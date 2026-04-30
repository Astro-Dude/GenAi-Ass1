"use client";

import { Persona } from "@/lib/personas";

export type ChatRole = "user" | "model";

interface Props {
  role: ChatRole;
  content: string;
  persona: Persona;
}

export default function MessageBubble({ role, content, persona }: Props) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-slate-900 px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm sm:text-[15px]">
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700"
          aria-hidden="true"
        >
          You
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          persona.accentClass,
        ].join(" ")}
        aria-hidden="true"
      >
        {persona.avatarInitials}
      </div>
      <div
        className={[
          "max-w-[85%] rounded-2xl rounded-bl-md border px-4 py-2.5 text-sm leading-relaxed shadow-sm sm:text-[15px]",
          persona.bubbleClass,
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}
