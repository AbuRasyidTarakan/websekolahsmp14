"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/image-uploader";
import { X, GripVertical } from "lucide-react";

interface Anggota {
  nama: string;
  jabatan: string;
  foto_url?: string;
}

export function StrukturOrganisasiEditor({ initialData }: { initialData: Anggota[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [daftar, setDaftar] = useState<Anggota[]>(initialData.length > 0 ? initialData : []);
  const [saving, setSaving] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function tambahAnggota() {
    setDaftar((d) => [...d, { nama: "", jabatan: "", foto_url: "" }]);
    setSukses(false);
  }

  function hapusAnggota(index: number) {
    setDaftar((d) => d.filter((_, i) => i !== index));
    setSukses(false);
  }

  function updateAnggota(index: number, field: keyof Anggota, value: string) {
    setDaftar((d) => d.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
    setSukses(false);
  }

  function pindahUrutan(index: number, arah: -1 | 1) {
    const target = index + arah;
    if (target < 0 || target >= daftar.length) return;
    setDaftar((d) => {
      const baru = [...d];
      [baru[index], baru[target]] = [baru[target], baru[index]];
      return baru;
    });
  }

  async function handleSimpan() {
    setSaving(true);
    setError(null);

    const dataBersih = daftar.filter((a) => a.nama.trim() !== "");

    const { error: updateError } = await supabase
      .from("profil_sekolah")
      .update({ struktur_organisasi: dataBersih })
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
    <div className="mt-8 rounded-lg border border-border bg-white p-5">
      <h2 className="font-display text-lg font-bold">Struktur Organisasi</h2>
      <p className="mt-1 text-sm text-foreground/60">
        Kepala sekolah, wakil, dan jajaran lain yang tampil di halaman publik Profil Sekolah.
      </p>

      <div className="mt-4 space-y-4">
        {daftar.map((anggota, i) => (
          <div key={i} className="flex gap-3 rounded-lg border border-border p-4">
            <div className="flex flex-col items-center gap-1 pt-1 text-foreground/30">
              <button type="button" onClick={() => pindahUrutan(i, -1)} disabled={i === 0} className="hover:text-foreground disabled:opacity-30">
                ▲
              </button>
              <GripVertical className="h-4 w-4" />
              <button type="button" onClick={() => pindahUrutan(i, 1)} disabled={i === daftar.length - 1} className="hover:text-foreground disabled:opacity-30">
                ▼
              </button>
            </div>

            <div className="w-28 shrink-0">
              <Label className="text-xs">Foto</Label>
              <div className="mt-1">
                <ImageUploader value={anggota.foto_url ?? null} onChange={(url) => updateAnggota(i, "foto_url", url)} />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor={`nama-${i}`} className="text-xs">Nama</Label>
                <Input
                  id={`nama-${i}`}
                  className="mt-1"
                  value={anggota.nama}
                  onChange={(e) => updateAnggota(i, "nama", e.target.value)}
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <Label htmlFor={`jabatan-${i}`} className="text-xs">Jabatan</Label>
                <Input
                  id={`jabatan-${i}`}
                  className="mt-1"
                  value={anggota.jabatan}
                  onChange={(e) => updateAnggota(i, "jabatan", e.target.value)}
                  placeholder="Contoh: Kepala Sekolah"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => hapusAnggota(i)}
              className="h-fit text-foreground/40 hover:text-red-600"
              title="Hapus"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {daftar.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-foreground/50">
            Belum ada anggota struktur organisasi.
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="button" variant="outline" onClick={tambahAnggota}>
          + Tambah Anggota
        </Button>
        <Button type="button" onClick={handleSimpan} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Struktur Organisasi"}
        </Button>
      </div>

      {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {sukses && <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Tersimpan!</p>}
    </div>
  );
}
