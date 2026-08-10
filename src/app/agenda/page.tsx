import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

const WARNA_KATEGORI: Record<string, string> = {
  Akademik: "#1F6F6B",
  Libur: "#D4A017",
  Ujian: "#7A2B2B",
  Ekstrakurikuler: "#3b82f6",
  Lainnya: "#6b7280",
};

function formatTanggal(tgl: string) {
  return new Date(tgl).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default async function AgendaPage() {
  const supabase = await createClient();
  const hariIni = new Date().toISOString().split("T")[0];

  const { data: mendatang } = await supabase
    .from("agenda")
    .select("*")
    .gte("tanggal_mulai", hariIni)
    .order("tanggal_mulai", { ascending: true });

  const { data: lewat } = await supabase
    .from("agenda")
    .select("*")
    .lt("tanggal_mulai", hariIni)
    .order("tanggal_mulai", { ascending: false })
    .limit(10);

  function DaftarAgenda({ items }: { items: typeof mendatang }) {
    if (!items || items.length === 0) {
      return <p className="text-sm text-foreground/50">Belum ada agenda.</p>;
    }
    return (
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="flex gap-4 rounded-lg border border-border bg-white p-4">
            <div className="w-20 shrink-0 text-center">
              <p className="font-display text-lg font-bold text-primary">
                {new Date(a.tanggal_mulai).getDate()}
              </p>
              <p className="text-xs uppercase text-foreground/50">
                {new Date(a.tanggal_mulai).toLocaleDateString("id-ID", { month: "short" })}
              </p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {a.kategori && (
                  <Badge style={{ backgroundColor: WARNA_KATEGORI[a.kategori] ?? "#6b7280" }}>
                    {a.kategori}
                  </Badge>
                )}
              </div>
              <p className="mt-1 font-semibold">{a.judul_kegiatan}</p>
              {a.deskripsi && <p className="mt-1 text-sm text-foreground/60">{a.deskripsi}</p>}
              {a.tanggal_selesai && (
                <p className="mt-1 text-xs text-foreground/40">
                  Sampai {formatTanggal(a.tanggal_selesai)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Agenda & Kalender Akademik</h1>

        <section className="mt-6">
          <h2 className="font-display text-lg font-bold">Akan Datang</h2>
          <div className="mt-3">
            <DaftarAgenda items={mendatang} />
          </div>
        </section>

        {lewat && lewat.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-bold text-foreground/50">Sudah Berlalu</h2>
            <div className="mt-3 opacity-60">
              <DaftarAgenda items={lewat} />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
