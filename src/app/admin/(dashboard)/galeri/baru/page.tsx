"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiImageUploader, type FotoTerupload } from "@/components/admin/multi-image-uploader";

export default function AlbumBaruPage() {
  const router = useRouter();
  const supabase = createClient();

  const [judulAlbum, setJudulAlbum] = useState("");
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [foto, setFoto] = useState<FotoTerupload[]>([]);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuatAlbum(e: React.FormEvent) {
    e.preventDefault();
    if (!judulAlbum.trim()) {
      setError("Judul album wajib diisi.");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi login berakhir, silakan login ulang.");

      const { data, error: insertError } = await supabase
        .from("galeri_album")
        .insert({ judul_album: judulAlbum.trim(), penulis_id: user.id })
        .select("id")
        .single();

      if (insertError) throw insertError;
      setAlbumId(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat album.");
    } finally {
      setCreating(false);
    }
  }

  async function handleSelesai() {
    if (!albumId) return;
    setSaving(true);
    setError(null);

    try {
      if (foto.length === 0) throw new Error("Tambahkan minimal 1 foto sebelum menyelesaikan album.");

      const rows = foto.map((f, i) => ({
        album_id: albumId,
        url_foto: f.url,
        caption: f.caption || null,
        urutan: i,
      }));

      const { error: fotoError } = await supabase.from("galeri_foto").insert(rows);
      if (fotoError) throw fotoError;

      // Set cover album pakai foto pertama
      await supabase.from("galeri_album").update({ cover_url: foto[0].url }).eq("id", albumId);

      router.push("/admin/galeri");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan foto ke album.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Album Galeri Baru</h1>

      {/* Tahap 1: buat album */}
      {!albumId ? (
        <form onSubmit={handleBuatAlbum} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="judul-album">Judul Album</Label>
            <Input
              id="judul-album"
              value={judulAlbum}
              onChange={(e) => setJudulAlbum(e.target.value)}
              placeholder="Contoh: Kegiatan MPLS Tahun Ajaran 2026/2027"
              className="mt-1"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={creating}>
            {creating ? "Membuat album..." : "Lanjut: Upload Foto →"}
          </Button>
        </form>
      ) : (
        // Tahap 2: upload foto ke album yang baru dibuat
        <div className="mt-6 space-y-4">
          <p className="text-sm text-foreground/60">
            Album <strong>{judulAlbum}</strong> berhasil dibuat. Sekarang tambahkan fotonya:
          </p>

          <MultiImageUploader albumId={albumId} value={foto} onChange={setFoto} />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button onClick={handleSelesai} disabled={saving || foto.length === 0}>
            {saving ? "Menyimpan..." : `Selesai (${foto.length} foto)`}
          </Button>
        </div>
      )}
    </div>
  );
}
