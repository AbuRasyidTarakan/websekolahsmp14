"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { X } from "lucide-react";
import type { Profile } from "@/types/database.types";

interface EditUserModalProps {
  profile: Profile;
  onClose: () => void;
  onSaved: () => void;
}

export function EditUserModal({ profile, onClose, onSaved }: EditUserModalProps) {
  const [email, setEmail] = useState(profile.email ?? "");
  const [namaLengkap, setNamaLengkap] = useState(profile.nama_lengkap);
  const [jabatan, setJabatan] = useState(profile.jabatan ?? "");
  const [fotoProfil, setFotoProfil] = useState<string | null>(profile.foto_profil);
  const [role, setRole] = useState(profile.role);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: profile.id,
          email,
          nama_lengkap: namaLengkap,
          jabatan,
          foto_profil: fotoProfil,
          role,
          password: password || undefined, // kosong = tidak diubah
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal menyimpan perubahan.");

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Edit Pengguna</h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="edit-nama">Nama Lengkap</Label>
            <Input id="edit-nama" className="mt-1" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="edit-jabatan">Jabatan</Label>
            <Input id="edit-jabatan" className="mt-1" value={jabatan} onChange={(e) => setJabatan(e.target.value)} />
          </div>

          <div>
            <Label>Foto Profil</Label>
            <div className="mt-1">
              <ImageUploader value={fotoProfil} onChange={setFotoProfil} />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-role">Peran</Label>
            <Select id="edit-role" className="mt-1" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
              <option value="editor">Editor</option>
              <option value="staf_tu">Editor (Staf TU)</option>
              <option value="super_admin">Super Admin</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-password">Password Baru (opsional)</Label>
            <Input
              id="edit-password"
              type="password"
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ingin mengubah password"
            />
          </div>

          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
