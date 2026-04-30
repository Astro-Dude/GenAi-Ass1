# Scaler Personas — Persona-Based AI Chatbot

A persona-based chatbot that lets you have real conversations with three Scaler / InterviewBit personalities — **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**. Each persona is driven by a hand-crafted system prompt with few-shot examples, a chain-of-thought instruction, and explicit constraints, and runs on Google's Gemini API.

> Built for Assignment 01 — Persona-Based AI Chatbot, Prompt Engineering, Scaler Academy.

---

## Live demo

**https://YOUR-DEPLOYED-URL.vercel.app** _(replace once deployed)_

---

## What's inside

- **3 distinct personas**, each with their own system prompt, suggestion chips, and visual accent.
  - **Anshuman Singh** — Co-founder, ex-Facebook, calm and direct.
  - **Abhimanyu Saxena** — Co-founder, ex-Fab.com, founder of Scaler School of Technology.
  - **Kshitij Mishra** — Head of Instructors, ex-Amazon, Socratic DSA mentor.
- **Persona switcher** (tabs) — switching personas resets the conversation.
- **Suggestion chips** per persona for quick starts.
- **Typing indicator** while the model is thinking.
- **Error states** that are user-friendly, never silent.
- **Mobile-first responsive layout** built with Tailwind.
- **API key handled server-side** via env var. Never sent to the browser.

---

## Tech stack

| Layer       | Choice                                                      |
| ----------- | ----------------------------------------------------------- |
| Framework   | Next.js 14 (App Router)                                     |
| Language    | TypeScript                                                  |
| Styling     | Tailwind CSS                                                |
| Model       | Google Gemini (`gemini-2.5-flash` by default)               |
| SDK         | `@google/generative-ai`                                     |
| Hosting     | Vercel (one-click deploy)                                   |

The frontend, the API route (`/api/chat`), and the persona definitions all live in this single repo.

---

## Project structure

```
.
├─ app/
│  ├─ api/chat/route.ts     # POST /api/chat — server-side Gemini call
│  ├─ globals.css           # Tailwind + small custom rules
│  ├─ layout.tsx            # Root layout
│  └─ page.tsx              # Main chat UI
├─ components/
│  ├─ MessageBubble.tsx
│  ├─ PersonaSwitcher.tsx
│  ├─ SuggestionChips.tsx
│  └─ TypingIndicator.tsx
├─ lib/
│  └─ personas.ts           # The 3 system prompts + UI metadata
├─ prompts.md               # Annotated copy of all 3 system prompts
├─ reflection.md            # 300–500 word reflection
├─ .env.example             # Template — copy to .env.local
└─ ...
```

---

## Local setup

You need Node.js 18+ and a Gemini API key.

```bash
# 1. Install dependencies
npm install

# 2. Get a Gemini API key — https://aistudio.google.com/app/apikey
#    Then create your local env file:
cp .env.example .env.local
#    Open .env.local and paste your key into GEMINI_API_KEY=...

# 3. Run the dev server
npm run dev

# 4. Open http://localhost:3000
```

If you want to run a production build locally:

```bash
npm run build
npm run start
```

---

## Environment variables

| Variable          | Required | Default              | Purpose                                                      |
| ----------------- | -------- | -------------------- | ------------------------------------------------------------ |
| `GEMINI_API_KEY`  | yes      | —                    | Your Gemini API key. Server-side only.                       |
| `GEMINI_MODEL`    | no       | `gemini-2.5-flash`   | Override the model. Try `gemini-2.0-flash` for lower latency. |

Never commit `.env.local`. The provided `.env.example` is the only env file in the repo.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. In **Project Settings → Environment Variables**, add:
   - `GEMINI_API_KEY` = your key
   - (optional) `GEMINI_MODEL` = `gemini-2.5-flash`
4. Click **Deploy**. Vercel auto-detects Next.js — no extra config needed.

The whole project — frontend + API route — deploys as a single Vercel app.

---

## How the persona system works

1. The frontend keeps the active persona ID in React state and the conversation history as an array of `{ role, content }`.
2. On send, the frontend POSTs `{ personaId, history, message }` to `/api/chat`.
3. The API route loads the corresponding persona from `lib/personas.ts` and passes its **system prompt** as `systemInstruction` to the Gemini SDK, then forwards the history + new user message.
4. The model reply is returned to the frontend and appended to the conversation.
5. **Switching personas wipes the history**, so every conversation is scoped to one persona.

The system prompts themselves include:
- Detailed persona descriptions (background, beliefs, voice).
- 3 few-shot user/assistant examples per persona.
- An explicit chain-of-thought instruction (reason silently before replying).
- Output format rules (length, tone, ending question).
- Constraints (never break character, no guarantees, no emojis, etc.).

See [`prompts.md`](./prompts.md) for the annotated breakdown.

---

## Submission checklist

- [x] Public GitHub repo
- [x] `README.md` with setup instructions and a placeholder for the live link
- [x] `prompts.md` with all 3 system prompts + inline annotations
- [x] `reflection.md` (300–500 words)
- [x] `.env.example` present, no real key committed
- [ ] App deployed on Vercel _(replace placeholder above with the live URL)_
- [x] All 3 personas working
- [x] Persona switching resets the conversation
- [x] Graceful API error handling
- [x] Mobile-responsive UI

---

## Screenshots

_Add screenshots of the chat UI, persona switcher, and a sample conversation here once deployed._

---

## License

MIT — for educational use as part of the Scaler Academy assignment.
