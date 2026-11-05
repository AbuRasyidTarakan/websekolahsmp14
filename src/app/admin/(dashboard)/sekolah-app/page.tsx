import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SekolahAppForm } from "@/components/admin/sekolah-app-form";
import { SekolahAppList } from "@/components/admin/sekolah-app-list";
import type { SekolahApp } from "@/types/database.types";

export default async function KelolaSekolahAppPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") redirect("/admin");

  const { data, error } = await supabase
    .from("sekolah_app")
    .select("*")
    .order("urutan", { ascending: true })
    .order("nama", { ascending: true });

  const items = (data ?? []) as SekolahApp[];

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Sekolah App</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Daftar link aplikasi sekolah (portal, piket, dll). Yang aktif otomatis tampil di menu atas, footer, dan halaman{" "}
        <code>/sekolah-app</code> pada website.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Tabel database belum siap.</p>
          <p className="mt-1">
            Jalankan isi file <code>supabase/sekolah_app.sql</code> sekali di Supabase Dashboard → SQL Editor, lalu muat
            ulang halaman ini. Pesan dari database: <span className="italic">{error.message}</span>
          </p>
        </div>
      )}

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold text-slate-800">Tambah Aplikasi</h2>
        <div className="mt-4">
          <SekolahAppForm />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold">Semua Aplikasi</h2>
        <p className="mt-1 text-xs text-foreground/50">Urutan kecil tampil lebih dulu. Matikan saklar untuk menyembunyikan tanpa menghapus.</p>
        <div className="mt-3">
          <SekolahAppList items={items} />
        </div>
      </section>
    </div>
  );
}
