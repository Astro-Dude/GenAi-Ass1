"use client";

import { Persona } from "@/lib/personas";

interface Props {
  persona: Persona;
  onPick: (text: string) => void;
  disabled?: boolean;
}

export default function SuggestionChips({ persona, onPick, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {persona.suggestionChips.map((chip) => (
        <button
          key={chip}
          type="button"
          disabled={disabled}
          onClick={() => onPick(chip)}
          className={[
            "rounded-full border px-3 py-1.5 text-xs sm:text-sm font-medium transition",
            "border-slate-300 bg-white text-slate-700 shadow-sm",
            "hover:border-slate-400 hover:bg-slate-50",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
