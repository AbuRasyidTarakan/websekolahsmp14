"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { extractStoragePath } from "@/lib/storage-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/image-uploader";

interface GuruStaffFormProps {
  mode: "create" | "edit";
  itemId?: string;
  initialData?: {
    nama_lengkap: string;
    nip: string;
    jabatan: string;
    mata_pelajaran: string;
    foto_url: string | null;
    urutan: number;
    is_active: boolean;
  };
}

export function GuruStaffForm({ mode, itemId, initialData }: GuruStaffFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [namaLengkap, setNamaLengkap] = useState(initialData?.nama_lengkap ?? "");
  const [nip, setNip] = useState(initialData?.nip ?? "");
  const [jabatan, setJabatan] = useState(initialData?.jabatan ?? "");
  const [mataPelajaran, setMataPelajaran] = useState(initialData?.mata_pelajaran ?? "");
  const [fotoUrl, setFotoUrl] = useState<string | null>(initialData?.foto_url ?? null);
  const [urutan, setUrutan] = useState(initialData?.urutan ?? 0);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!namaLengkap.trim()) throw new Error("Nama lengkap wajib diisi.");

      const payload = {
        nama_lengkap: namaLengkap.trim(),
        nip: nip.trim() || null,
        jabatan: jabatan.trim() || null,
        mata_pelajaran: mataPelajaran.trim() || null,
        foto_url: fotoUrl,
        urutan,
        is_active: isActive,
      };

      if (mode === "create") {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Sesi login berakhir, silakan login ulang.");

        const { error: insertError } = await supabase.from("guru_staff").insert({ ...payload, penulis_id: user.id });
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase.from("guru_staff").update(payload).eq("id", itemId);
        if (updateError) throw updateError;
      }

      router.push("/admin/guru-staff");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!itemId || !window.confirm(`Hapus data "${namaLengkap}" dari direktori Guru & Staff?`)) return;
    setDeleting(true);

    const fotoPath = extractStoragePath(fotoUrl, "gambar-website");
    if (fotoPath) await supabase.storage.from("gambar-website").remove([fotoPath]);

    const { error: deleteError } = await supabase.from("guru_staff").delete().eq("id", itemId);
    setDeleting(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    router.push("/admin/guru-staff");
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold">{mode === "create" ? "Tambah Guru/Staff" : "Edit Guru/Staff"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input id="nama" className="mt-1" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nip">NIP (opsional)</Label>
            <Input id="nip" className="mt-1" value={nip} onChange={(e) => setNip(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="jabatan">Jabatan</Label>
            <Input id="jabatan" className="mt-1" value={jabatan} onChange={(e) => setJabatan(e.target.value)} placeholder="Contoh: Kepala Sekolah, Guru IPA" />
          </div>
        </div>

        <div>
          <Label htmlFor="mapel">Mata Pelajaran (opsional, khusus guru)</Label>
          <Input id="mapel" className="mt-1" value={mataPelajaran} onChange={(e) => setMataPelajaran(e.target.value)} />
        </div>

        <div>
          <Label>Foto</Label>
          <div className="mt-1">
            <ImageUploader value={fotoUrl} onChange={setFotoUrl} />
          </div>
        </div>

        <div>
          <Label htmlFor="urutan">Urutan Tampil (angka kecil tampil duluan)</Label>
          <Input id="urutan" type="number" className="mt-1 w-32" value={urutan} onChange={(e) => setUrutan(parseInt(e.target.value) || 0)} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Tampilkan di halaman publik Guru & Staff
        </label>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
          {mode === "edit" && (
            <Button type="button" variant="destructive" disabled={deleting} onClick={handleDelete} className="ml-auto">
              {deleting ? "Menghapus..." : "Hapus"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
