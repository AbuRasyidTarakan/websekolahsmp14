"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabKelola: React.ReactNode;
  tabSemua: React.ReactNode;
}

export function PenggunaTabs({ tabKelola, tabSemua }: TabsProps) {
  const [aktif, setAktif] = useState<"kelola" | "semua">("kelola");

  return (
    <div>
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setAktif("kelola")}
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium",
            aktif === "kelola" ? "border-primary text-primary" : "border-transparent text-foreground/50 hover:text-foreground"
          )}
        >
          Kelola Pengguna
        </button>
        <button
          onClick={() => setAktif("semua")}
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium",
            aktif === "semua" ? "border-primary text-primary" : "border-transparent text-foreground/50 hover:text-foreground"
          )}
        >
          Semua Pengguna
        </button>
      </div>

      <div className="mt-6">
        {aktif === "kelola" && tabKelola}
        {aktif === "semua" && tabSemua}
      </div>
    </div>
  );
}
