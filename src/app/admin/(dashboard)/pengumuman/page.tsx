import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PengumumanForm } from "@/components/admin/pengumuman-form";
import { PengumumanList } from "@/components/admin/pengumuman-list";

export default async function KelolaPengumumanPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  const { data: bannerList } = await supabase
    .from("pengumuman_banner")
    .select("id, pesan, is_active, created_at, dibuat_oleh:profiles(nama_lengkap)")
    .order("created_at", { ascending: false });

  const isSuperAdmin = profile?.role === "super_admin";

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Pengumuman Darurat</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Pesan singkat yang muncul sebagai strip di paling atas semua halaman publik — untuk info mendesak
        seperti libur mendadak atau perubahan jadwal.
      </p>

      <section className="mt-6 rounded-lg border border-border bg-white p-5">
        <h2 className="font-display text-lg font-bold">Buat Pengumuman Baru</h2>
        <PengumumanForm />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold">Semua Pengumuman</h2>
        {!isSuperAdmin && (
          <p className="mt-1 text-xs text-foreground/50">
            Hanya super admin yang bisa mengaktifkan/menonaktifkan/menghapus pengumuman.
          </p>
        )}
        <div className="mt-3">
          {/* @ts-expect-error - relasi join */}
          <PengumumanList items={bannerList ?? []} bolehKelola={isSuperAdmin} />
        </div>
      </section>
    </div>
  );
}
