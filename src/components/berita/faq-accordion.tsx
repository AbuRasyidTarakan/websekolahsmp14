"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/types/database.types";

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [terbuka, setTerbuka] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {items.map((f) => {
        const isOpen = terbuka === f.id;
        return (
          <div key={f.id} className="rounded-lg border border-border bg-white">
            <button
              onClick={() => setTerbuka(isOpen ? null : f.id)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
            >
              <span className="font-medium">{f.pertanyaan}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-foreground/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="whitespace-pre-line px-4 pb-4 text-sm text-foreground/70">{f.jawaban}</p>}
          </div>
        );
      })}
    </div>
  );
}
