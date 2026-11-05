"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { domainDari, urlAman } from "@/lib/sekolah-app-url";
import { Switch } from "@/components/ui/switch";
import { SekolahAppForm } from "@/components/admin/sekolah-app-form";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { SekolahApp } from "@/types/database.types";

export function SekolahAppList({ items }: { items: SekolahApp[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  async function toggleAktif(item: SekolahApp) {
    setBusyId(item.id);
    await supabase.from("sekolah_app").update({ is_active: !item.is_active }).eq("id", item.id);
    setBusyId(null);
    router.refresh();
  }

  async function hapus(item: SekolahApp) {
    if (!window.confirm(`Hapus "${item.nama}" dari daftar Sekolah App?`)) return;
    setBusyId(item.id);
    await supabase.from("sekolah_app").delete().eq("id", item.id);
    setBusyId(null);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-foreground/50">
        Belum ada aplikasi. Tambahkan yang pertama lewat formulir di atas.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) =>
        editId === item.id ? (
          <div key={item.id} className="rounded-lg border border-primary/40 bg-white p-4">
            <SekolahAppForm item={item} onSelesai={() => setEditId(null)} />
          </div>
        ) : (
          <div key={item.id} className="flex items-center gap-4 rounded-lg border border-border bg-white p-4 text-slate-800">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-medium">
                <span className="truncate">{item.nama}</span>
                {!item.is_active && (
                  <span className="shrink-0 rounded-full bg-gray-400 px-2 py-0.5 text-[10px] font-medium text-white">Nonaktif</span>
                )}
              </p>
              <a
                href={urlAman(item.url) ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                {domainDari(item.url)} <ExternalLink className="h-3 w-3" />
              </a>
              {item.deskripsi && <p className="mt-1 text-sm text-slate-500">{item.deskripsi}</p>}
            </div>

            <span className="hidden text-xs text-slate-400 sm:block" title="Urutan tampil">
              #{item.urutan}
            </span>

            <div className="flex items-center gap-3">
              <Switch checked={item.is_active} disabled={busyId === item.id} onChange={() => toggleAktif(item)} />
              <button title="Ubah" onClick={() => setEditId(item.id)} className="text-slate-500 hover:text-primary">
                <Pencil className="h-4 w-4" />
              </button>
              <button title="Hapus" onClick={() => hapus(item)} disabled={busyId === item.id} className="text-slate-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
