"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getYoutubeThumbnail } from "@/lib/youtube-helpers";
import { Trash2, PlayCircle } from "lucide-react";
import type { VideoKegiatan } from "@/types/database.types";

export function VideoList({
  items,
  currentUserId,
  isSuperAdmin,
}: {
  items: VideoKegiatan[];
  currentUserId: string;
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function hapus(id: string, judul: string) {
    if (!window.confirm(`Hapus video "${judul}"?`)) return;
    setBusyId(id);
    await supabase.from("video_kegiatan").delete().eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-foreground/50">Belum ada video.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((v) => {
        const thumb = getYoutubeThumbnail(v.youtube_url);
        const bolehHapus = isSuperAdmin || v.penulis_id === currentUserId;
        return (
          <div key={v.id} className="flex items-center gap-3 rounded-lg border border-border bg-white p-3">
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded bg-black/10">
              {thumb && <Image src={thumb} alt={v.judul} fill className="object-cover" />}
              <PlayCircle className="absolute inset-0 m-auto h-6 w-6 text-white drop-shadow" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{v.judul}</p>
              {v.deskripsi && <p className="mt-0.5 line-clamp-1 text-xs text-foreground/50">{v.deskripsi}</p>}
            </div>
            {bolehHapus && (
              <button title="Hapus" onClick={() => hapus(v.id, v.judul)} disabled={busyId === v.id} className="text-foreground/60 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
