"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

// Daftar tabel yang di-backup. `kunjungan` sengaja tidak diikutkan
// (data analitik murni, terus bertambah, bukan konten yang perlu dijaga).
const DAFTAR_TABEL = [
  "profiles",
  "kategori",
  "berita",
  "galeri_album",
  "galeri_foto",
  "agenda",
  "profil_sekolah",
  "pengumuman_banner",
  "dokumen",
  "faq",
  "guru_staff",
  "video_kegiatan",
  "sekolah_app",
  "log_aktivitas",
] as const;

export function BackupButton() {
  const supabase = createClient();
  const [proses, setProses] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBackup() {
    setError(null);
    const hasil: Record<string, unknown> = {
      dibuat_pada: new Date().toISOString(),
      keterangan: "Backup data Portal Berita SMP Negeri 14 Tarakan. Tidak termasuk file di Storage dan tabel kunjungan.",
      tabel: {},
    };

    try {
      for (const nama of DAFTAR_TABEL) {
        setProses(`Mengambil data tabel "${nama}"...`);
        const { data, error: fetchError } = await supabase.from(nama).select("*");
        if (fetchError) throw new Error(`Gagal ambil tabel ${nama}: ${fetchError.message}`);
        (hasil.tabel as Record<string, unknown>)[nama] = data;
      }

      setProses("Menyiapkan file unduhan...");

      const blob = new Blob([JSON.stringify(hasil, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const tanggal = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `backup-portal-berita-${tanggal}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat backup.");
    } finally {
      setProses(null);
    }
  }

  return (
    <div>
      <Button onClick={handleBackup} disabled={!!proses}>
        {proses ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {proses}
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" /> Download Backup (JSON)
          </>
        )}
      </Button>
      {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
