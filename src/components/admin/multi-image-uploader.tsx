"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compress-image";

export interface FotoTerupload {
  url: string;
  caption: string;
}

interface MultiImageUploaderProps {
  albumId: string;
  value: FotoTerupload[];
  onChange: (foto: FotoTerupload[]) => void;
}

export function MultiImageUploader({ albumId, value, onChange }: MultiImageUploaderProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi login berakhir, silakan login ulang.");

      const hasilUpload: FotoTerupload[] = [];

      for (const file of files) {
        const compressed = await compressImage(file);
        const path = `${user.id}/galeri/${albumId}/${Date.now()}-${compressed.name}`;

        const { error: uploadError } = await supabase.storage
          .from("gambar-website")
          .upload(path, compressed, { upsert: false });
        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage.from("gambar-website").getPublicUrl(path);
        hasilUpload.push({ url: publicUrl.publicUrl, caption: "" });
      }

      onChange([...value, ...hasilUpload]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload salah satu foto.");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input supaya bisa pilih file yang sama lagi kalau perlu
    }
  }

  function updateCaption(index: number, caption: string) {
    const next = [...value];
    next[index] = { ...next[index], caption };
    onChange(next);
  }

  function removeFoto(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesChange}
          disabled={uploading}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
        />
      </label>

      {uploading && <p className="text-sm text-foreground/60">Mengompres & mengunggah foto…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((foto, i) => (
            <div key={foto.url} className="relative rounded-md border border-border p-2">
              <button
                type="button"
                onClick={() => removeFoto(i)}
                className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="relative aspect-square overflow-hidden rounded">
                <Image src={foto.url} alt="" fill className="object-cover" />
              </div>
              <input
                type="text"
                placeholder="Caption (opsional)"
                value={foto.caption}
                onChange={(e) => updateCaption(i, e.target.value)}
                className="mt-2 w-full rounded border border-border px-2 py-1 text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
