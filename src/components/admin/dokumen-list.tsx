"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2 } from "lucide-react";
import { extractStoragePath } from "@/lib/storage-helpers";
import type { Dokumen } from "@/types/database.types";

function formatUkuran(bytes: number | null) {
  if (!bytes) return "-";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DokumenList({
  items,
  currentUserId,
  isSuperAdmin,
}: {
  items: Dokumen[];
  currentUserId: string;
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function hapus(id: string, judul: string) {
    if (!window.confirm(`Hapus dokumen "${judul}"?`)) return;
    setBusyId(id);

    const item = items.find((d) => d.id === id);
    const path = extractStoragePath(item?.file_url, "dokumen-sekolah");
    if (path) {
      await supabase.storage.from("dokumen-sekolah").remove([path]);
    }

    await supabase.from("dokumen").delete().eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-foreground/50">Belum ada dokumen.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((d) => {
        const bolehHapus = isSuperAdmin || d.penulis_id === currentUserId;
        return (
          <div key={d.id} className="flex items-center gap-3 rounded-lg border border-border bg-white p-4">
            <FileText className="h-8 w-8 shrink-0 text-primary/60" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{d.judul}</p>
                <Badge className="bg-secondary">{d.kategori}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-foreground/50">
                {d.file_name} · {formatUkuran(d.file_size)}
              </p>
            </div>
            {bolehHapus && (
              <button title="Hapus" onClick={() => hapus(d.id, d.judul)} disabled={busyId === d.id} className="text-foreground/60 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
