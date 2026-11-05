"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normalisasiUrl } from "@/lib/sekolah-app-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SekolahApp } from "@/types/database.types";

interface SekolahAppFormProps {
  /** Kalau diisi = mode ubah; kalau kosong = mode tambah baru */
  item?: SekolahApp;
  onSelesai?: () => void;
}

export function SekolahAppForm({ item, onSelesai }: SekolahAppFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [nama, setNama] = useState(item?.nama ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [deskripsi, setDeskripsi] = useState(item?.deskripsi ?? "");
  const [urutan, setUrutan] = useState(String(item?.urutan ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nama.trim()) return setError("Nama aplikasi wajib diisi.");
    const urlBersih = normalisasiUrl(url);
    if (!urlBersih) return setError("Alamat tidak valid. Contoh yang benar: portalsmp14.vercel.app");

    setSaving(true);
    const data = {
      nama: nama.trim(),
      url: urlBersih,
      deskripsi: deskripsi.trim() || null,
      urutan: Number.parseInt(urutan, 10) || 0,
    };

    let errorSimpan;
    if (item) {
      ({ error: errorSimpan } = await supabase.from("sekolah_app").update(data).eq("id", item.id));
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      ({ error: errorSimpan } = await supabase.from("sekolah_app").insert({ ...data, dibuat_oleh: user?.id }));
    }
    setSaving(false);

    if (errorSimpan) {
      setError(errorSimpan.message);
      return;
    }

    if (!item) {
      setNama("");
      setUrl("");
      setDeskripsi("");
      setUrutan("0");
    }
    router.refresh();
    onSelesai?.();
  }

  const idDasar = item ? `app-${item.id}` : "app-baru";

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-slate-800">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${idDasar}-nama`}>Nama Aplikasi</Label>
          <Input id={`${idDasar}-nama`} className="mt-1" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Portal SMP 14" />
        </div>
        <div>
          <Label htmlFor={`${idDasar}-url`}>Alamat (URL)</Label>
          <Input id={`${idDasar}-url`} className="mt-1" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="portalsmp14.vercel.app" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
        <div>
          <Label htmlFor={`${idDasar}-deskripsi`}>Keterangan singkat (opsional)</Label>
          <Input id={`${idDasar}-deskripsi`} className="mt-1" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Contoh: Portal layanan dan informasi sekolah" />
        </div>
        <div>
          <Label htmlFor={`${idDasar}-urutan`}>Urutan</Label>
          <Input id={`${idDasar}-urutan`} type="number" className="mt-1" value={urutan} onChange={(e) => setUrutan(e.target.value)} />
        </div>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : item ? "Simpan Perubahan" : "Tambah Aplikasi"}
        </Button>
        {item && (
          <Button type="button" variant="outline" onClick={onSelesai} disabled={saving}>
            Batal
          </Button>
        )}
      </div>
    </form>
  );
}
