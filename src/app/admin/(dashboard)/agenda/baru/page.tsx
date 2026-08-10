"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { KategoriAgenda } from "@/types/database.types";

const KATEGORI_OPSI = ["Akademik", "Libur", "Ujian", "Ekstrakurikuler", "Lainnya"];

export default function TambahAgendaPage() {
  const router = useRouter();
  const supabase = createClient();

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [kategori, setKategori] = useState("Akademik");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi login berakhir, silakan login ulang.");
      if (!judul.trim() || !tanggalMulai) throw new Error("Judul dan tanggal mulai wajib diisi.");

      const { error: insertError } = await supabase.from("agenda").insert({
        judul_kegiatan: judul.trim(),
        deskripsi: deskripsi.trim() || null,
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai || null,
        kategori: kategori as KategoriAgenda,
        penulis_id: user.id,
      });

      if (insertError) throw insertError;

      router.push("/admin/agenda");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan agenda.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold">Tambah Agenda</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="judul">Nama Kegiatan</Label>
          <Input id="judul" className="mt-1" value={judul} onChange={(e) => setJudul(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="deskripsi">Deskripsi</Label>
          <Textarea id="deskripsi" className="mt-1" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="tanggal-mulai">Tanggal Mulai</Label>
            <Input id="tanggal-mulai" type="date" className="mt-1" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tanggal-selesai">Tanggal Selesai (opsional)</Label>
            <Input id="tanggal-selesai" type="date" className="mt-1" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} />
          </div>
        </div>

        <div>
          <Label htmlFor="kategori">Kategori</Label>
          <Select id="kategori" className="mt-1" value={kategori} onChange={(e) => setKategori(e.target.value)}>
            {KATEGORI_OPSI.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </Select>
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Agenda"}
        </Button>
      </form>
    </div>
  );
}
