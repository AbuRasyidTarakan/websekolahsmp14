"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GantiPasswordForm() {
  const supabase = createClient();
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sukses, setSukses] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSukses(false);

    if (!passwordLama) {
      setError("Password lama wajib diisi.");
      return;
    }
    if (passwordBaru.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }
    if (passwordBaru !== konfirmasi) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setSaving(true);

    // 1. Verifikasi password lama dulu — coba "login ulang" pakai email + password lama.
    //    Kalau salah, signInWithPassword akan error dan proses dihentikan di sini.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setError("Sesi login berakhir, silakan login ulang.");
      setSaving(false);
      return;
    }

    const { error: verifError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: passwordLama,
    });

    if (verifError) {
      setError("Password lama salah.");
      setSaving(false);
      return;
    }

    // 2. Password lama terverifikasi benar, baru boleh ganti ke password baru
    const { error: updateError } = await supabase.auth.updateUser({ password: passwordBaru });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSukses(true);
    setPasswordLama("");
    setPasswordBaru("");
    setKonfirmasi("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="password-lama">Password Lama</Label>
        <Input id="password-lama" type="password" className="mt-1" value={passwordLama} onChange={(e) => setPasswordLama(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="password-baru">Password Baru</Label>
        <Input id="password-baru" type="password" className="mt-1" value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="konfirmasi-password">Konfirmasi Password Baru</Label>
        <Input id="konfirmasi-password" type="password" className="mt-1" value={konfirmasi} onChange={(e) => setKonfirmasi(e.target.value)} />
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {sukses && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Password berhasil diubah!</p>}

      <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Ganti Password"}</Button>
    </form>
  );
}
