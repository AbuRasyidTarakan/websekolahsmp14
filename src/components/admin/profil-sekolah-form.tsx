"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";

interface FormData {
  nama_sekolah: string;
  npsn: string;
  deskripsi_singkat: string;
  visi: string;
  misi: string;
  sejarah: string;
  alamat: string;
  telepon: string;
  email: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  logo_url: string | null;
}

export function ProfilSekolahForm({ initialData }: { initialData: FormData }) {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSukses(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("profil_sekolah")
      .update({
        nama_sekolah: form.nama_sekolah || null,
        npsn: form.npsn || null,
        deskripsi_singkat: form.deskripsi_singkat || null,
        visi: form.visi || null,
        misi: form.misi.split("\n").map((s) => s.trim()).filter(Boolean),
        sejarah: form.sejarah || null,
        alamat: form.alamat || null,
        telepon: form.telepon || null,
        email: form.email || null,
        instagram_url: form.instagram_url || null,
        facebook_url: form.facebook_url || null,
        youtube_url: form.youtube_url || null,
        logo_url: form.logo_url,
      })
      .eq("id", 1);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSukses(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <Label htmlFor="nama_sekolah">Nama Sekolah</Label>
        <Input id="nama_sekolah" className="mt-1" value={form.nama_sekolah} onChange={(e) => update("nama_sekolah", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="deskripsi_singkat">Tagline / Deskripsi Singkat</Label>
        <Input
          id="deskripsi_singkat"
          className="mt-1"
          value={form.deskripsi_singkat}
          onChange={(e) => update("deskripsi_singkat", e.target.value)}
          placeholder="Tampil di footer, contoh: Portal berita dan informasi resmi kegiatan sekolah."
        />
      </div>

      <div>
        <Label htmlFor="npsn">NPSN</Label>
        <Input id="npsn" className="mt-1" value={form.npsn} onChange={(e) => update("npsn", e.target.value)} />
      </div>

      <div>
        <Label>Logo Sekolah</Label>
        <div className="mt-1">
          <ImageUploader value={form.logo_url} onChange={(url) => update("logo_url", url)} />
        </div>
      </div>

      <div>
        <Label htmlFor="visi">Visi</Label>
        <Textarea id="visi" className="mt-1" value={form.visi} onChange={(e) => update("visi", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="misi">Misi (satu poin per baris)</Label>
        <Textarea
          id="misi"
          className="mt-1"
          rows={5}
          value={form.misi}
          onChange={(e) => update("misi", e.target.value)}
          placeholder={"Contoh:\nMenyelenggarakan pendidikan berkualitas...\nMengembangkan potensi siswa..."}
        />
      </div>

      <div>
        <Label htmlFor="sejarah">Sejarah</Label>
        <Textarea id="sejarah" className="mt-1" rows={5} value={form.sejarah} onChange={(e) => update("sejarah", e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="alamat">Alamat</Label>
          <Input id="alamat" className="mt-1" value={form.alamat} onChange={(e) => update("alamat", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="telepon">Telepon</Label>
          <Input id="telepon" className="mt-1" value={form.telepon} onChange={(e) => update("telepon", e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" className="mt-1" value={form.email} onChange={(e) => update("email", e.target.value)} />
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="text-sm font-semibold">Media Sosial (tampil di footer)</p>
        <div className="mt-3 space-y-3">
          <div>
            <Label htmlFor="instagram_url">Instagram</Label>
            <Input id="instagram_url" className="mt-1" placeholder="https://instagram.com/..." value={form.instagram_url} onChange={(e) => update("instagram_url", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="facebook_url">Facebook</Label>
            <Input id="facebook_url" className="mt-1" placeholder="https://facebook.com/..." value={form.facebook_url} onChange={(e) => update("facebook_url", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="youtube_url">YouTube</Label>
            <Input id="youtube_url" className="mt-1" placeholder="https://youtube.com/..." value={form.youtube_url} onChange={(e) => update("youtube_url", e.target.value)} />
          </div>
        </div>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {sukses && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Tersimpan!</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
