"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";

interface PengumumanItem {
  id: string;
  pesan: string;
  is_active: boolean;
  created_at: string;
  dibuat_oleh: { nama_lengkap: string } | null;
}

export function PengumumanList({ items, bolehKelola }: { items: PengumumanItem[]; bolehKelola: boolean }) {
  const router = useRouter();
  const supabase = createClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleAktif(id: string, isActive: boolean) {
    setBusyId(id);
    await supabase.from("pengumuman_banner").update({ is_active: !isActive }).eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  async function hapus(id: string) {
    if (!window.confirm("Hapus pengumuman ini?")) return;
    setBusyId(id);
    await supabase.from("pengumuman_banner").delete().eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-foreground/50">Belum ada pengumuman.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 rounded-lg border border-border bg-white p-4">
          <div className="flex-1">
            <p className="text-sm">{item.pesan}</p>
            <p className="mt-1 text-xs text-foreground/50">
              {item.dibuat_oleh?.nama_lengkap ?? "-"} ·{" "}
              {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {bolehKelola ? (
            <div className="flex items-center gap-4">
              <Switch checked={item.is_active} disabled={busyId === item.id} onChange={() => toggleAktif(item.id, item.is_active)} />
              <button title="Hapus" onClick={() => hapus(item.id)} disabled={busyId === item.id} className="text-foreground/60 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium text-white ${item.is_active ? "bg-green-600" : "bg-gray-400"}`}>
              {item.is_active ? "Aktif" : "Nonaktif"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
