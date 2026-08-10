"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getYoutubeId } from "@/lib/youtube-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function VideoForm() {
  const router = useRouter();
  const supabase = createClient();

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
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
      if (!judul.trim()) throw new Error("Judul video wajib diisi.");
      if (!getYoutubeId(youtubeUrl.trim())) throw new Error("Link YouTube tidak valid.");

      const { error: insertError } = await supabase.from("video_kegiatan").insert({
        judul: judul.trim(),
        deskripsi: deskripsi.trim() || null,
        youtube_url: youtubeUrl.trim(),
        penulis_id: user.id,
      });
      if (insertError) throw insertError;

      setJudul("");
      setDeskripsi("");
      setYoutubeUrl("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan video.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <Label htmlFor="judul-video">Judul Video</Label>
        <Input id="judul-video" className="mt-1" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Contoh: Dokumentasi Upacara HUT Sekolah ke-30" />
      </div>

      <div>
        <Label htmlFor="deskripsi-video">Deskripsi (opsional)</Label>
        <Textarea id="deskripsi-video" className="mt-1" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="youtube-url">Link YouTube</Label>
        <Input id="youtube-url" className="mt-1" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Tambah Video"}</Button>
    </form>
  );
}
