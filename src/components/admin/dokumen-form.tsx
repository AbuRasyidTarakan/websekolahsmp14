"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { KategoriDokumen } from "@/types/database.types";

const KATEGORI_OPSI = ["Kalender Akademik", "Formulir", "Tata Tertib", "Surat Edaran", "Lainnya"];

export function DokumenForm() {
  const router = useRouter();
  const supabase = createClient();

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("Formulir");
  const [file, setFile] = useState<File | null>(null);
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
      if (!judul.trim()) throw new Error("Judul dokumen wajib diisi.");
      if (!file) throw new Error("Pilih file terlebih dahulu.");
      if (file.size > 10 * 1024 * 1024) throw new Error("Ukuran file maksimal 10MB.");

      const path = `${user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage.from("dokumen-sekolah").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("dokumen-sekolah").getPublicUrl(path);

      const { error: insertError } = await supabase.from("dokumen").insert({
        judul: judul.trim(),
        deskripsi: deskripsi.trim() || null,
        kategori: kategori as KategoriDokumen,
        file_url: publicUrl.publicUrl,
        file_name: file.name,
        file_size: file.size,
        penulis_id: user.id,
      });
      if (insertError) throw insertError;

      setJudul("");
      setDeskripsi("");
      setFile(null);
      (document.getElementById("file-dokumen") as HTMLInputElement).value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload dokumen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <Label htmlFor="judul-dokumen">Judul Dokumen</Label>
        <Input id="judul-dokumen" className="mt-1" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Contoh: Kalender Akademik 2026/2027" />
      </div>

      <div>
        <Label htmlFor="deskripsi-dokumen">Deskripsi (opsional)</Label>
        <Textarea id="deskripsi-dokumen" className="mt-1" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="kategori-dokumen">Kategori</Label>
        <Select id="kategori-dokumen" className="mt-1" value={kategori} onChange={(e) => setKategori(e.target.value)}>
          {KATEGORI_OPSI.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="file-dokumen">File (PDF, Word, atau Excel — maks 10MB)</Label>
        <input
          id="file-dokumen"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
        />
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Mengunggah..." : "Upload Dokumen"}
      </Button>
    </form>
  );
}
