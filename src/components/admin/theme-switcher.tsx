"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";
import type { TemaPreferensi } from "@/types/database.types";

const PILIHAN_TEMA: { value: TemaPreferensi; label: string; deskripsi: string; swatch: string[] }[] = [
  { value: "terang", label: "Terang", deskripsi: "Tampilan standar", swatch: ["#F5F3EE", "#20120C", "#7A2B2B"] },
  { value: "kontras", label: "Kontras Tinggi", deskripsi: "Teks lebih tegas", swatch: ["#FFFFFF", "#000000", "#7A2B2B"] },
  { value: "sepia", label: "Nyaman Mata (Sepia)", deskripsi: "Hangat, mengurangi silau", swatch: ["#EFE3C8", "#3D2B14", "#7A2B2B"] },
  { value: "gelap_parsial", label: "Gelap Parsial", deskripsi: "Latar gelap, kartu tetap terang", swatch: ["#1C2028", "#EBEBEB", "#7A2B2B"] },
];

export function ThemeSwitcher({ temaSaatIni }: { temaSaatIni: TemaPreferensi }) {
  const router = useRouter();
  const supabase = createClient();
  const [selected, setSelected] = useState(temaSaatIni);
  const [saving, setSaving] = useState(false);

  async function pilihTema(tema: TemaPreferensi) {
    setSelected(tema);
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ tema_preferensi: tema }).eq("id", user.id);
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PILIHAN_TEMA.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => pilihTema(t.value)}
            disabled={saving}
            className={`relative rounded-lg border-2 p-3 text-left transition-colors ${
              selected === t.value ? "border-primary" : "border-border hover:border-primary/40"
            }`}
          >
            {selected === t.value && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                <Check className="h-3 w-3" />
              </span>
            )}
            <div className="flex gap-1">
              {t.swatch.map((warna, i) => (
                <span key={i} className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: warna }} />
              ))}
            </div>
            <p className="mt-2 text-sm font-semibold">{t.label}</p>
            <p className="text-xs text-foreground/50">{t.deskripsi}</p>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-foreground/50">
        Tema ini berlaku di panel admin, tersimpan di akun — otomatis ikut kalau login dari perangkat lain.
      </p>
    </div>
  );
}
