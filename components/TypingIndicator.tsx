"use client";

import { Persona } from "@/lib/personas";

export default function TypingIndicator({ persona }: { persona: Persona }) {
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
          "rounded-2xl border px-4 py-3",
          persona.bubbleClass,
        ].join(" ")}
        aria-label={`${persona.name} is typing`}
        role="status"
      >
        <div className="flex items-center gap-1.5">
          <span className="block h-2 w-2 rounded-full bg-slate-500 animate-dot-1" />
          <span className="block h-2 w-2 rounded-full bg-slate-500 animate-dot-2" />
          <span className="block h-2 w-2 rounded-full bg-slate-500 animate-dot-3" />
        </div>
      </div>
    </div>
  );
}
