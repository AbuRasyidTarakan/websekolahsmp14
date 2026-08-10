import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Users, TrendingUp } from "lucide-react";

function tanggalWita(offsetHari = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetHari);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Makassar" }); // format YYYY-MM-DD
}

export default async function StatistikPengunjungPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") redirect("/admin");

  // Ambil semua kunjungan 7 hari terakhir sekaligus, agregasi dilakukan di JS
  // (volume data 1 sekolah masih kecil, tidak perlu RPC/agregasi SQL khusus)
  const tanggalAwal = tanggalWita(-6);
  const { data: rows } = await supabase
    .from("kunjungan")
    .select("visitor_id, halaman, tanggal_wita")
    .gte("tanggal_wita", tanggalAwal);

  const semua = rows ?? [];

  const hariIni = tanggalWita(0);
  const kemarin = tanggalWita(-1);

  const uniqueVisitor = (tgl: string) =>
    new Set(semua.filter((r) => r.tanggal_wita === tgl).map((r) => r.visitor_id)).size;

  const pengunjungHariIni = uniqueVisitor(hariIni);
  const pengunjungKemarin = uniqueVisitor(kemarin);

  // Data 7 hari untuk grafik batang sederhana
  const grafik7Hari = Array.from({ length: 7 }, (_, i) => {
    const tgl = tanggalWita(-6 + i);
    return { tanggal: tgl, jumlah: uniqueVisitor(tgl) };
  });
  const maksGrafik = Math.max(1, ...grafik7Hari.map((g) => g.jumlah));

  // Halaman terpopuler (total kunjungan, bukan unik) 7 hari terakhir
  const hitungHalaman = new Map<string, number>();
  semua.forEach((r) => hitungHalaman.set(r.halaman, (hitungHalaman.get(r.halaman) ?? 0) + 1));
  const halamanTerpopuler = [...hitungHalaman.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Statistik Pengunjung</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Dihitung dari pengunjung unik (per browser), bukan jumlah klik/refresh halaman.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center gap-2 text-foreground/50">
            <Users className="h-4 w-4" />
            <p className="text-sm">Pengunjung Hari Ini</p>
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-primary">{pengunjungHariIni}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center gap-2 text-foreground/50">
            <Users className="h-4 w-4" />
            <p className="text-sm">Pengunjung Kemarin</p>
          </div>
          <p className="mt-2 font-display text-3xl font-bold">{pengunjungKemarin}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-white p-5">
        <div className="flex items-center gap-2 text-foreground/50">
          <TrendingUp className="h-4 w-4" />
          <p className="text-sm font-semibold">7 Hari Terakhir</p>
        </div>
        <div className="mt-4 flex h-32 items-end gap-2">
          {grafik7Hari.map((g) => (
            <div key={g.tanggal} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-primary"
                style={{ height: `${Math.max(4, (g.jumlah / maksGrafik) * 100)}%` }}
                title={`${g.jumlah} pengunjung`}
              />
              <span className="text-[10px] text-foreground/50">
                {new Date(g.tanggal).toLocaleDateString("id-ID", { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-white p-5">
        <p className="text-sm font-semibold text-foreground/50">Halaman Terpopuler (7 Hari Terakhir)</p>
        <div className="mt-3 space-y-2">
          {halamanTerpopuler.length === 0 && <p className="text-sm text-foreground/40">Belum ada data.</p>}
          {halamanTerpopuler.map(([halaman, jumlah]) => (
            <div key={halaman} className="flex items-center justify-between text-sm">
              <span className="truncate text-foreground/70">{halaman}</span>
              <span className="shrink-0 font-medium">{jumlah}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
