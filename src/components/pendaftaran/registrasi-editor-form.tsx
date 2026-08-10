"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

type Tahap = "form" | "selesai";

export function RegistrasiEditorForm() {
  const router = useRouter();
  const supabase = createClient();

  const [tahap, setTahap] = useState<Tahap>("form");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [alasan, setAlasan] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDaftar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!namaLengkap.trim() || !email.trim()) {
      setError("Nama lengkap dan email wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (password !== konfirmasiPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setSaving(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          nama_lengkap: namaLengkap.trim(),
          jabatan: jabatan.trim(),
          alasan_daftar: alasan.trim(),
          daftar_mandiri: "true",
        },
      },
    });

    setSaving(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Langsung logout kalau ternyata Supabase otomatis bikin sesi
    // (tidak masalah walau sesi aktif, karena is_active=false tetap memblokir panel admin —
    // tapi lebih rapi kalau memang langsung diarahkan keluar dulu)
    await supabase.auth.signOut();
    setTahap("selesai");
  }

  if (tahap === "selesai") {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h1 className="mt-3 font-display text-xl font-bold">Pendaftaran Berhasil!</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Akun Anda sudah tercatat dan akan aktif setelah disetujui admin sekolah — silakan tunggu konfirmasi
          lebih lanjut.
        </p>
        <Button onClick={() => router.push("/")} variant="outline" className="mt-6">
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-2xl font-bold">Daftar Jadi Editor Berita</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Untuk guru & staf SMP Negeri 14 Tarakan yang ingin ikut menulis berita kegiatan sekolah. Akun akan aktif
        setelah disetujui admin.
      </p>

      <form onSubmit={handleDaftar} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input id="nama" className="mt-1" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="jabatan">Jabatan</Label>
          <Input id="jabatan" className="mt-1" value={jabatan} onChange={(e) => setJabatan(e.target.value)} placeholder="Contoh: Guru IPA, Staf TU" />
        </div>
        <div>
          <Label htmlFor="email">Email Aktif</Label>
          <Input id="email" type="email" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          <p className="mt-1 text-xs text-foreground/50">Gunakan email aktif yang bisa dihubungi admin sekolah.</p>
        </div>
        <div>
          <Label htmlFor="password">Buat Password</Label>
          <Input id="password" type="password" className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="konfirmasi">Konfirmasi Password</Label>
          <Input id="konfirmasi" type="password" className="mt-1" value={konfirmasiPassword} onChange={(e) => setKonfirmasiPassword(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="alasan">Kenapa tertarik jadi editor? (opsional)</Label>
          <Textarea id="alasan" className="mt-1" value={alasan} onChange={(e) => setAlasan(e.target.value)} />
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Memproses..." : "Daftar Sekarang"}
        </Button>
      </form>
    </>
  );
}
