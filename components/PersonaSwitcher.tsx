"use client";

import { PERSONAS, PERSONA_ORDER, PersonaId } from "@/lib/personas";

interface Props {
  activeId: PersonaId;
  onChange: (id: PersonaId) => void;
}

export default function PersonaSwitcher({ activeId, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Choose a persona"
      className="flex w-full gap-2 overflow-x-auto rounded-xl bg-white/70 p-1.5 shadow-sm ring-1 ring-slate-200 backdrop-blur"
    >
      {PERSONA_ORDER.map((id) => {
        const p = PERSONAS[id];
        const active = id === activeId;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={[
              "flex-1 min-w-[8rem] rounded-lg px-3 py-2 text-sm font-medium transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
              active
                ? `${p.accentClass} shadow-md`
                : "bg-transparent text-slate-700 hover:bg-slate-100",
            ].join(" ")}
          >
            <div className="flex items-center justify-center gap-2">
              <span
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  active ? "bg-white/20 text-white" : `${p.accentClass}`,
                ].join(" ")}
              >
                {p.avatarInitials}
              </span>
              <span className="truncate">{p.name.split(" ")[0]}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
