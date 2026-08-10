"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  content: React.ReactNode;
}

export function SimpleTabs({ tabs }: { tabs: Tab[] }) {
  const [aktif, setAktif] = useState(0);

  return (
    <div>
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setAktif(i)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium",
              aktif === i ? "border-primary text-primary" : "border-transparent text-foreground/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">{tabs[aktif]?.content}</div>
    </div>
  );
}
