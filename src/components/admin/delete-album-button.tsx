"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { extractStoragePath } from "@/lib/storage-helpers";
import { Trash2 } from "lucide-react";

export function DeleteAlbumButton({
  albumId,
  judulAlbum,
  urlFotoList,
}: {
  albumId: string;
  judulAlbum: string;
  urlFotoList: string[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Hapus album "${judulAlbum}" beserta semua fotonya (${urlFotoList.length} foto)? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    setDeleting(true);

    // Hapus semua file foto di storage dulu (dedup path, karena cover_url bisa duplikat dengan salah satu foto)
    const paths = [...new Set(urlFotoList.map((url) => extractStoragePath(url, "gambar-website")).filter(Boolean))] as string[];
    if (paths.length > 0) {
      await supabase.storage.from("gambar-website").remove(paths);
    }

    // Hapus baris album — baris galeri_foto ikut terhapus otomatis (ON DELETE CASCADE)
    await supabase.from("galeri_album").delete().eq("id", albumId);

    setDeleting(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      title="Hapus album"
      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 shadow hover:bg-white disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
