"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { TemaPreferensi } from "@/types/database.types";

// Tombol cepat Terang <-> Gelap di topbar. Memakai sistem tema yang sudah ada
// ("terang" dan "gelap_parsial"), jadi pilihannya tersimpan di akun (profiles.tema_preferensi)
// dan sinkron dengan halaman Profil Saya. Tema lain (kontras/sepia) tetap bisa dipilih di sana.
export function ThemeToggle({ temaSaatIni }: { temaSaatIni: TemaPreferensi }) {
  const supabase = createClient();
  const [tema, setTema] = useState(temaSaatIni);
  const gelap = tema === "gelap_parsial";

  // Ikut berubah kalau tema diganti dari halaman Profil Saya
  useEffect(() => setTema(temaSaatIni), [temaSaatIni]);

  async function toggle() {
    const baru: TemaPreferensi = gelap ? "terang" : "gelap_parsial";
    setTema(baru);
    // Terapkan langsung tanpa menunggu server, baru simpan ke akun
    document.querySelector("[data-theme]")?.setAttribute("data-theme", baru);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").update({ tema_preferensi: baru }).eq("id", user.id);
  }

  return (
    <button
      onClick={toggle}
      aria-label={gelap ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      title={gelap ? "Mode Terang" : "Mode Gelap"}
      className="shrink-0 rounded-lg p-2 text-chrome-muted transition-colors hover:bg-chrome-hover hover:text-chrome-strong"
    >
      {gelap ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
