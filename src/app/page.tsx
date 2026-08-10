import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSlider } from "@/components/berita/hero-slider";
import { KategoriChips } from "@/components/berita/kategori-chips";
import { BeritaCard } from "@/components/berita/berita-card";

export default async function BerandaPage() {
  const supabase = await createClient();

  const [{ data: berandaBerita }, { data: kategoriList }] = await Promise.all([
    supabase
      .from("berita")
      .select("id, judul, slug, ringkasan, thumbnail_url, is_featured, published_at, kategori(nama, warna)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(12),
    supabase.from("kategori").select("*").order("urutan"),
  ]);

  // Featured tetap dipakai untuk Hero Slider, tapi grid "Berita Terbaru" di bawah
  // menampilkan SEMUA berita terbaru (termasuk yang sedang tampil di slider) —
  // supaya tidak terasa "hilang" kalau semua berita kebetulan ditandai featured.
  const featured = (berandaBerita ?? []).filter((b) => b.is_featured);
  const terbaru = berandaBerita ?? [];

  return (
    <>
      <Navbar />

      {/* @ts-expect-error - relasi join kategori berupa objek tunggal di runtime */}
      <HeroSlider items={featured.length > 0 ? featured : berandaBerita?.slice(0, 3) ?? []} />

      <KategoriChips items={kategoriList ?? []} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Berita Terbaru</h1>
          <a href="/berita" className="text-sm font-medium text-primary hover:underline">
            Lihat semua →
          </a>
        </div>

        {terbaru.length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-border p-10 text-center text-foreground/50">
            Belum ada berita yang dipublikasikan.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {terbaru.map((b) => (
              <BeritaCard
                key={b.id}
                judul={b.judul}
                slug={b.slug}
                ringkasan={b.ringkasan}
                thumbnail_url={b.thumbnail_url}
                published_at={b.published_at}
                // @ts-expect-error - relasi join
                kategori={b.kategori}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
