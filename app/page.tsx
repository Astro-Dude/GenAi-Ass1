"use client";

import { useEffect, useRef, useState } from "react";
import PersonaSwitcher from "@/components/PersonaSwitcher";
import MessageBubble, { ChatRole } from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import SuggestionChips from "@/components/SuggestionChips";
import { PERSONAS, PersonaId } from "@/lib/personas";

interface Message {
  id: string;
  role: ChatRole;
  content: string;
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export default function HomePage() {
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>("anshuman");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persona = PERSONAS[activePersonaId];
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [input]);

  function handlePersonaChange(id: PersonaId) {
    if (id === activePersonaId) return;
    setActivePersonaId(id);
    setMessages([]);
    setError(null);
    setInput("");
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setError(null);
    const userMsg: Message = { id: newId(), role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: activePersonaId,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          message: trimmed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Request failed.");
      }
      const reply: string = data.reply;
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "model", content: reply },
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  function handleResetConversation() {
    setMessages([]);
    setError(null);
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col px-3 py-4 sm:px-5 sm:py-6">
      {/* Header */}
      <header className="mb-3 flex flex-col gap-1 sm:mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            Scaler Personas
          </h1>
          <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
            Powered by Gemini
          </span>
        </div>
        <p className="text-xs text-slate-500 sm:text-sm">
          Chat with three Scaler / InterviewBit personalities. Switching personas resets the conversation.
        </p>
      </header>

      {/* Persona switcher */}
      <PersonaSwitcher activeId={activePersonaId} onChange={handlePersonaChange} />

      {/* Active persona card */}
      <section
        aria-live="polite"
        className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur sm:p-4"
      >
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold sm:h-12 sm:w-12",
            persona.accentClass,
          ].join(" ")}
          aria-hidden="true"
        >
          {persona.avatarInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
              {persona.name}
            </h2>
            <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 sm:inline">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-600 sm:text-[13px]">{persona.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
            {persona.shortBio}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleResetConversation}
            className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 sm:text-xs"
          >
            Clear chat
          </button>
        )}
      </section>

      {/* Chat area */}
      <section
        ref={scrollRef}
        className="chat-scroll mt-3 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white/60 p-3 shadow-sm backdrop-blur sm:p-4"
        aria-label={`Conversation with ${persona.name}`}
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
            <div
              className={[
                "flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold",
                persona.accentClass,
              ].join(" ")}
              aria-hidden="true"
            >
              {persona.avatarInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 sm:text-base">
                Start a conversation with {persona.name.split(" ")[0]}.
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Pick a quick-start question or type your own.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <SuggestionChips
                persona={persona}
                onPick={(t) => void sendMessage(t)}
                disabled={isSending}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                content={m.content}
                persona={persona}
              />
            ))}
            {isSending && <TypingIndicator persona={persona} />}
          </div>
        )}
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:text-sm"
        >
          {error}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="mt-3 flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:p-2.5"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${persona.name.split(" ")[0]} anything...`}
          rows={1}
          disabled={isSending}
          className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none sm:text-[15px]"
          aria-label={`Message ${persona.name}`}
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className={[
            "flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-4 text-sm font-medium transition",
            "disabled:cursor-not-allowed disabled:opacity-50",
            persona.accentClass,
            "hover:opacity-90",
          ].join(" ")}
        >
          <span>Send</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>

      <p className="mt-2 text-center text-[11px] text-slate-400 sm:text-xs">
        Responses are generated by an AI model with persona-specific system prompts. Not affiliated with Scaler.
      </p>
    </main>
  );
}
