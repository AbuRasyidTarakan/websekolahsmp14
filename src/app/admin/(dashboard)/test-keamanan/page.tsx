"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export default function TestKeamananPage() {
  const supabase = createClient();
  const [hasil, setHasil] = useState<{ berhasilDiblokir: boolean; pesan: string } | null>(null);
  const [proses, setProses] = useState(false);

  async function coba() {
    setProses(true);
    setHasil(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setHasil({ berhasilDiblokir: false, pesan: "Anda belum login." });
      setProses(false);
      return;
    }

    // Simulasi PERSIS seperti serangan sungguhan: pakai sesi login SAAT INI
    // (bukan service_role key), coba ubah role & is_active milik SENDIRI.
    const { error } = await supabase
      .from("profiles")
      .update({ role: "super_admin", is_active: true })
      .eq("id", user.id);

    setProses(false);

    if (error) {
      // Ini hasil yang DIHARAPKAN — trigger berhasil menolak percobaan ini
      setHasil({ berhasilDiblokir: true, pesan: error.message });
    } else {
      // Ini BAHAYA — berarti percobaan tadi berhasil, celah masih terbuka
      setHasil({ berhasilDiblokir: false, pesan: "Update berhasil dijalankan tanpa penolakan sama sekali." });
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-bold">Tes Keamanan: Naik Jabatan Sendiri</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Halaman ini mencoba (dari akun yang SEDANG login sekarang) mengubah kolom <code>role</code> jadi{" "}
        <code>super_admin</code> dan <code>is_active</code> jadi <code>true</code> pada baris miliknya sendiri —
        persis simulasi serangan yang kita bahas. Kalau perbaikan sudah benar, ini HARUS gagal/ditolak.
      </p>

      <Button onClick={coba} disabled={proses} className="mt-6">
        {proses ? "Mencoba..." : "Coba Naikkan Role Sendiri"}
      </Button>

      {hasil && (
        <div
          className={`mt-6 rounded-lg border p-4 ${
            hasil.berhasilDiblokir ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
          }`}
        >
          <p className={`flex items-center gap-2 font-semibold ${hasil.berhasilDiblokir ? "text-green-700" : "text-red-700"}`}>
            {hasil.berhasilDiblokir ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            {hasil.berhasilDiblokir ? "AMAN — Percobaan Berhasil Diblokir" : "BAHAYA — Celah Masih Terbuka!"}
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            {hasil.berhasilDiblokir ? "Pesan penolakan dari database:" : "Detail:"} {hasil.pesan}
          </p>
        </div>
      )}

      <p className="mt-8 rounded-md bg-accent/10 px-3 py-2 text-xs text-foreground/60">
        ⚠️ Halaman ini cuma untuk keperluan tes internal. Hapus folder <code>src/app/admin/(dashboard)/test-keamanan</code>{" "}
        sebelum benar-benar dipakai publik/deploy.
      </p>
    </div>
  );
}
