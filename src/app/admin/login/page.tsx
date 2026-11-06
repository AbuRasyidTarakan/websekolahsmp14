import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Login Admin" };

export default async function LoginPage() {
  // Logo & nama sekolah diambil dari Profil Sekolah (bisa diganti lewat panel admin)
  const supabase = await createClient();
  const { data: profil } = await supabase.from("profil_sekolah").select("nama_sekolah, logo_url").eq("id", 1).single();
  const namaSekolah = profil?.nama_sekolah ?? "SMP Negeri 14 Tarakan";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#14305a] via-[#1B3A6B] to-[#1F6F6B] px-4 py-10">
      {/* Hiasan latar berwarna */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-[28rem] w-[28rem] rounded-full bg-primary/80 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#2fb6a8]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-10 h-72 w-72 rounded-full bg-sky-400/40 blur-3xl" />
      {/* Lingkaran garis tipis untuk kesan kedalaman */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[32rem] w-[32rem] rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-48 bottom-0 h-[36rem] w-[36rem] rounded-full border border-white/10" />

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/20">
          {/* Garis warna di atas kartu */}
          <div className="h-1.5 bg-gradient-to-r from-accent via-primary to-[#1F6F6B]" />

          <div className="px-7 pb-8 pt-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-accent/20 to-primary/10 p-2 shadow-lg ring-4 ring-accent/40">
                {profil?.logo_url ? (
                  <Image
                    src={profil.logo_url}
                    alt={`Logo ${namaSekolah}`}
                    fill
                    priority
                    sizes="96px"
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-accent font-display text-3xl font-bold text-accent-foreground">
                    14
                  </div>
                )}
              </div>

              <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">Login Guru / Admin</h1>
              <p className="mt-1 text-sm font-medium text-primary">{namaSekolah}</p>
              <p className="mt-0.5 text-xs text-slate-500">Masuk untuk mengelola konten website sekolah</p>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Daftar jadi editor
              </Link>
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke website
        </Link>
        <p className="mt-2 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {namaSekolah}
        </p>
      </div>
    </main>
  );
}
