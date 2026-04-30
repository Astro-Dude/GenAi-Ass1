import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERSONAS, PersonaId } from "@/lib/personas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatTurn {
  role: "user" | "model";
  content: string;
}

interface ChatRequestBody {
  personaId: PersonaId;
  history: ChatTurn[];
  message: string;
}

const MAX_HISTORY_TURNS = 20;
const MAX_MESSAGE_CHARS = 4000;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing GEMINI_API_KEY. Please configure it in your environment." },
        { status: 500 },
      );
    }

    const body = (await req.json()) as Partial<ChatRequestBody>;
    const personaId = body.personaId;
    const message = (body.message ?? "").trim();
    const historyInput = Array.isArray(body.history) ? body.history : [];

    if (!personaId || !PERSONAS[personaId]) {
      return NextResponse.json({ error: "Unknown persona." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json(
        { error: `Message too long (max ${MAX_MESSAGE_CHARS} characters).` },
        { status: 400 },
      );
    }

    const persona = PERSONAS[personaId];
    const history = historyInput
      .filter((t) => t && (t.role === "user" || t.role === "model") && typeof t.content === "string")
      .slice(-MAX_HISTORY_TURNS)
      .map((t) => ({ role: t.role, parts: [{ text: t.content }] }));

    // Gemini requires history to start with a user turn. Drop leading model turns just in case.
    while (history.length > 0 && history[0].role !== "user") {
      history.shift();
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: persona.systemPrompt,
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 1024,
        // Disable extended "thinking" so the budget goes to the actual reply.
        // Safe to ignore on models that don't support this field.
        thinkingConfig: { thinkingBudget: 0 },
      } as unknown as Record<string, unknown>,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const reply = result.response.text().trim();

    if (!reply) {
      return NextResponse.json(
        { error: "The model returned an empty response. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/chat] error:", message);
    const safeMessage = message.includes("API key")
      ? "There's a problem with the server's API key configuration."
      : "Something went wrong while reaching the model. Please try again in a moment.";
    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }
}
