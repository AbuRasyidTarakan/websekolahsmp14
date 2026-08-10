import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GuruKontribusiCard } from "@/components/admin/guru-kontribusi-card";

export default async function LaporanGuruPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") redirect("/admin");

  const [{ data: semuaGuru }, { data: semuaBerita }] = await Promise.all([
    supabase.from("profiles").select("id, nama_lengkap, jabatan").order("nama_lengkap"),
    supabase.from("berita").select("id, judul, status, views, penulis_id"),
  ]);

  const daftarKontribusi = (semuaGuru ?? []).map((guru) => {
    const beritaGuruIni = (semuaBerita ?? []).filter((b) => b.penulis_id === guru.id);
    return {
      penulisId: guru.id,
      nama: guru.nama_lengkap,
      jabatan: guru.jabatan,
      totalBerita: beritaGuruIni.length,
      totalPublished: beritaGuruIni.filter((b) => b.status === "published").length,
      totalViews: beritaGuruIni.reduce((sum, b) => sum + (b.views ?? 0), 0),
      daftarBerita: beritaGuruIni,
    };
  });

  // Urutkan dari yang paling produktif (jumlah berita terbanyak) duluan
  daftarKontribusi.sort((a, b) => b.totalBerita - a.totalBerita);

  const totalBeritaKeseluruhan = semuaBerita?.length ?? 0;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Laporan Kontribusi Guru</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Total {totalBeritaKeseluruhan} berita dari {daftarKontribusi.length} pengguna terdaftar. Klik nama untuk lihat daftar judulnya.
      </p>

      <div className="mt-6 space-y-2">
        {daftarKontribusi.map((data) => (
          <GuruKontribusiCard key={data.penulisId} data={data} />
        ))}
      </div>
    </div>
  );
}
