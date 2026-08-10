"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function CreateUserForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [role, setRole] = useState("editor");
  const [password, setPassword] = useState(generatePassword());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sukses, setSukses] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSukses(false);

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nama_lengkap: namaLengkap, jabatan, role }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal membuat akun.");

      setSukses(true);
      setEmail("");
      setNamaLengkap("");
      setJabatan("");
      setPassword(generatePassword());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat akun.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email Guru</Label>
          <Input id="email" type="email" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input id="nama" className="mt-1" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="jabatan">Jabatan</Label>
          <Input id="jabatan" className="mt-1" placeholder="Contoh: Guru IPA" value={jabatan} onChange={(e) => setJabatan(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="role">Peran</Label>
          <Select id="role" className="mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="editor">Editor (guru biasa)</option>
            <option value="staf_tu">Editor (Staf TU)</option>
            <option value="super_admin">Super Admin</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="password">Password Sementara</Label>
        <div className="mt-1 flex gap-2">
          <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="button" variant="outline" onClick={() => setPassword(generatePassword())}>
            Acak Ulang
          </Button>
        </div>
        <p className="mt-1 text-xs text-foreground/50">
          Sampaikan email & password ini langsung ke guru terkait (WhatsApp/tatap muka, bukan lewat tempat publik).
        </p>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {sukses && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Akun berhasil dibuat! Sampaikan email & password sementara di atas ke guru terkait.
        </p>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? "Membuat akun..." : "Buat Akun"}
      </Button>
    </form>
  );
}
