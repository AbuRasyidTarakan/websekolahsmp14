"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";
import { EditUserModal } from "@/components/admin/edit-user-modal";
import { Pencil, Trash2 } from "lucide-react";
import type { Profile } from "@/types/database.types";

const LABEL_PERAN: Record<string, string> = {
  super_admin: "Super Admin",
  editor: "Editor",
  staf_tu: "Editor (Staf TU)",
};

export function UserList({ profiles, currentUserId }: { profiles: Profile[]; currentUserId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  async function toggleActive(id: string, isActive: boolean) {
    setBusyId(id);
    await supabase.from("profiles").update({ is_active: !isActive }).eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  async function hapusUser(id: string, nama: string) {
    if (
      !window.confirm(
        `Yakin hapus akun "${nama}"? Semua berita/galeri miliknya TIDAK ikut terhapus, tapi akun login-nya hilang permanen.`
      )
    ) {
      return;
    }
    setBusyId(id);
    const res = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: id }),
    });
    setBusyId(null);
    if (!res.ok) {
      const json = await res.json();
      alert(json.error ?? "Gagal menghapus pengguna.");
      return;
    }
    router.refresh();
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-accent/5 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Jabatan</th>
              <th className="px-4 py-3 font-medium">Peran</th>
              <th className="px-4 py-3 text-center font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-4 font-medium">
                  {p.nama_lengkap}{" "}
                  {p.id === currentUserId && <span className="text-xs text-foreground/40">(Anda)</span>}
                </td>
                <td className="px-4 py-4 text-foreground/70">{p.jabatan ?? "-"}</td>
                <td className="px-4 py-4 text-foreground/70">{LABEL_PERAN[p.role] ?? p.role}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-6">
                    <span className="inline-flex items-center">
                      <Switch
                        checked={p.is_active}
                        disabled={p.id === currentUserId || busyId === p.id}
                        onChange={() => toggleActive(p.id, p.is_active)}
                      />
                    </span>
                    <button
                      title="Edit"
                      onClick={() => setEditingProfile(p)}
                      disabled={busyId === p.id}
                      className="text-foreground/60 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {p.id !== currentUserId && (
                      <button
                        title="Hapus"
                        onClick={() => hapusUser(p.id, p.nama_lengkap)}
                        disabled={busyId === p.id}
                        className="text-foreground/60 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProfile && (
        <EditUserModal
          profile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onSaved={() => {
            setEditingProfile(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
