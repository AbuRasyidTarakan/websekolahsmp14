"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compress-image";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi login berakhir, silakan login ulang.");

      // Kompres dulu (resize maks 1200px + WebP) sebelum upload
      const compressed = await compressImage(file);

      // Path WAJIB diawali {user_id}/ supaya cocok dengan RLS policy storage
      const path = `${user.id}/${Date.now()}-${compressed.name}`;

      const { error: uploadError } = await supabase.storage
        .from("gambar-website")
        .upload(path, compressed, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("gambar-website")
        .getPublicUrl(path);

      onChange(publicUrl.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload gambar.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative h-40 w-full overflow-hidden rounded-md border border-border">
          <Image src={value} alt="Pratinjau gambar" fill className="object-cover" />
        </div>
      )}

      <label className="block">
        <span className="sr-only">Pilih gambar</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
        />
      </label>

      {uploading && <p className="text-sm text-foreground/60">Mengompres & mengunggah gambar…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
