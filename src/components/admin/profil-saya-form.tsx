"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/image-uploader";

interface FormData {
  nama_lengkap: string;
  jabatan: string;
  foto_profil: string | null;
  email: string;
}

export function ProfilSayaForm({ initialData }: { initialData: FormData }) {
  const router = useRouter();
  const supabase = createClient();
  const [namaLengkap, setNamaLengkap] = useState(initialData.nama_lengkap);
  const [jabatan, setJabatan] = useState(initialData.jabatan);
  const [fotoProfil, setFotoProfil] = useState<string | null>(initialData.foto_profil);
  const [saving, setSaving] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSukses(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sesi login berakhir, silakan login ulang.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ nama_lengkap: namaLengkap.trim(), jabatan: jabatan.trim() || null, foto_profil: fotoProfil })
      .eq("id", user.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSukses(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="email-tampil">Email</Label>
        <Input id="email-tampil" value={initialData.email} disabled className="mt-1 bg-accent/5" />
        <p className="mt-1 text-xs text-foreground/50">Email tidak bisa diubah sendiri, hubungi super admin.</p>
      </div>

      <div>
        <Label htmlFor="nama-saya">Nama Lengkap</Label>
        <Input id="nama-saya" className="mt-1" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="jabatan-saya">Jabatan</Label>
        <Input id="jabatan-saya" className="mt-1" value={jabatan} onChange={(e) => setJabatan(e.target.value)} placeholder="Contoh: Guru Informatika" />
      </div>

      <div>
        <Label>Foto Profil</Label>
        <div className="mt-1">
          <ImageUploader value={fotoProfil} onChange={setFotoProfil} />
        </div>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {sukses && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Tersimpan!</p>}

      <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Perubahan"}</Button>
    </form>
  );
}
