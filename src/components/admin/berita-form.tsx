"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { extractStoragePath } from "@/lib/storage-helpers";
import { getYoutubeId } from "@/lib/youtube-helpers";
import type { Kategori } from "@/types/database.types";

interface BeritaFormProps {
  mode: "create" | "edit";
  beritaId?: string;
  initialData?: {
    judul: string;
    slug: string;
    ringkasan: string | null;
    konten: string;
    kategori_id: string | null;
    thumbnail_url: string | null;
    video_url: string | null;
    is_featured: boolean;
    status: "draft" | "published";
  };
}

export function BeritaForm({ mode, beritaId, initialData }: BeritaFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [judul, setJudul] = useState(initialData?.judul ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugManual, setSlugManual] = useState(mode === "edit"); // di mode edit, slug tidak auto-ubah
  const [ringkasan, setRingkasan] = useState(initialData?.ringkasan ?? "");
  const [konten, setKonten] = useState(initialData?.konten ?? "");
  const [kategoriId, setKategoriId] = useState(initialData?.kategori_id ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initialData?.thumbnail_url ?? null);
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url ?? "");
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("kategori")
      .select("*")
      .order("urutan")
      .then(({ data }) => setKategoriList(data ?? []));
  }, [supabase]);

  useEffect(() => {
    if (!slugManual) setSlug(slugify(judul));
  }, [judul, slugManual]);

  async function handleSubmit(e: React.FormEvent, statusTujuan: "draft" | "published") {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi login berakhir, silakan login ulang.");
      if (!judul.trim()) throw new Error("Judul berita wajib diisi.");
      if (!konten.trim()) throw new Error("Isi berita wajib diisi.");
      if (videoUrl.trim() && !getYoutubeId(videoUrl.trim())) {
        throw new Error("Link YouTube tidak valid. Contoh yang benar: https://youtube.com/watch?v=xxxxx");
      }

      const payload = {
        judul: judul.trim(),
        slug,
        ringkasan: ringkasan.trim() || null,
        konten,
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl.trim() || null,
        kategori_id: kategoriId || null,
        status: statusTujuan,
        is_featured: isFeatured,
      };

      if (mode === "create") {
        const { error: insertError } = await supabase.from("berita").insert({
          ...payload,
          penulis_id: user.id,
          published_at: statusTujuan === "published" ? new Date().toISOString() : null,
        });
        if (insertError) throw insertError;
      } else {
        const updatePayload: typeof payload & { published_at?: string } = { ...payload };
        // Kalau sebelumnya draft lalu sekarang dipublikasikan, catat tanggal publish sekarang
        if (initialData?.status === "draft" && statusTujuan === "published") {
          updatePayload.published_at = new Date().toISOString();
        }
        const { error: updateError } = await supabase
          .from("berita")
          .update(updatePayload)
          .eq("id", beritaId);
        if (updateError) throw updateError;
      }

      router.push("/admin/berita");
      router.refresh();
    } catch (err) {
      if (err instanceof Object && "code" in err && err.code === "23505") {
        setError("Slug ini sudah dipakai berita lain. Ubah judul atau edit slug manual.");
      } else {
        setError(err instanceof Error ? err.message : "Gagal menyimpan berita.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!beritaId) return;
    const konfirmasi = window.confirm(
      `Yakin ingin menghapus berita "${judul}"? Tindakan ini tidak bisa dibatalkan.`
    );
    if (!konfirmasi) return;

    setDeleting(true);
    setError(null);

    // Hapus dulu file thumbnail-nya dari storage (kalau ada), baru hapus baris datanya.
    // Catatan: gambar yang disisipkan DI DALAM konten (lewat editor) belum ikut dibersihkan
    // di sini — cukup rumit dilacak dari HTML, jadi untuk saat ini dibiarkan (dampaknya kecil
    // karena ukurannya sudah dikompres).
    const thumbnailPath = extractStoragePath(thumbnailUrl, "gambar-website");
    if (thumbnailPath) {
      await supabase.storage.from("gambar-website").remove([thumbnailPath]);
    }

    const { error: deleteError } = await supabase.from("berita").delete().eq("id", beritaId);

    if (deleteError) {
      setError("Gagal menghapus berita: " + deleteError.message);
      setDeleting(false);
      return;
    }

    router.push("/admin/berita");
    router.refresh();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">
        {mode === "create" ? "Tulis Berita Baru" : "Edit Berita"}
      </h1>

      <form className="mt-6 space-y-5">
        <div>
          <Label htmlFor="judul">Judul Berita</Label>
          <Input
            id="judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: Siswa SMPN 14 Tarakan Juara Lomba OSN Tingkat Provinsi"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugManual(true);
            }}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-foreground/50">Alamat halaman: /berita/{slug || "..."}</p>
        </div>

        <div>
          <Label htmlFor="ringkasan">Ringkasan Singkat</Label>
          <Textarea
            id="ringkasan"
            value={ringkasan}
            onChange={(e) => setRingkasan(e.target.value)}
            placeholder="1-2 kalimat ringkasan, tampil di card berita & hasil pencarian Google"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="kategori">Kategori</Label>
          <Select id="kategori" value={kategoriId} onChange={(e) => setKategoriId(e.target.value)} className="mt-1">
            <option value="">-- Pilih kategori --</option>
            {kategoriList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Foto Thumbnail</Label>
          <div className="mt-1">
            <ImageUploader value={thumbnailUrl} onChange={setThumbnailUrl} />
          </div>
        </div>

        <div>
          <Label htmlFor="video-youtube">Link Video YouTube (opsional)</Label>
          <Input
            id="video-youtube"
            className="mt-1"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
          <p className="mt-1 text-xs text-foreground/50">
            Video akan tampil di halaman detail berita, di bawah thumbnail.
          </p>
        </div>

        <div>
          <Label>Isi Berita</Label>
          <div className="mt-1">
            <RichTextEditor value={konten} onChange={setKonten} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Tampilkan di slider utama beranda (berita unggulan)
        </label>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" disabled={saving} onClick={(e) => handleSubmit(e, "draft")}>
            Simpan sebagai Draft
          </Button>
          <Button type="button" disabled={saving} onClick={(e) => handleSubmit(e, "published")}>
            {saving ? "Menyimpan..." : mode === "create" ? "Publikasikan" : "Simpan & Publikasikan"}
          </Button>

          {mode === "edit" && (
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
              className="ml-auto"
            >
              {deleting ? "Menghapus..." : "Hapus Berita"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
