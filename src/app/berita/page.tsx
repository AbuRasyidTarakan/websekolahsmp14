import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BeritaCard } from "@/components/berita/berita-card";
import { KategoriChips } from "@/components/berita/kategori-chips";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PER_HALAMAN = 9;

interface Props {
  searchParams: Promise<{ kategori?: string; q?: string; page?: string }>;
}

export default async function DaftarBeritaPage({ searchParams }: Props) {
  const { kategori, q, page } = await searchParams;
  const halaman = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const dari = (halaman - 1) * PER_HALAMAN;
  const sampai = dari + PER_HALAMAN - 1;

  const supabase = await createClient();

  let query = supabase
    .from("berita")
    .select(
      "id, judul, slug, ringkasan, thumbnail_url, published_at, kategori!inner(nama, warna, slug)",
      { count: "exact" }
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(dari, sampai);

  if (kategori) query = query.eq("kategori.slug", kategori);
  if (q) query = query.textSearch("search_vector", q, { type: "websearch", config: "indonesian" });

  const { data: beritaList, count } = await query;
  const { data: kategoriList } = await supabase.from("kategori").select("*").order("urutan");

  const totalHalaman = Math.max(1, Math.ceil((count ?? 0) / PER_HALAMAN));

  function buatUrl(params: { kategori?: string; q?: string; page?: number }) {
    const sp = new URLSearchParams();
    if (params.kategori) sp.set("kategori", params.kategori);
    if (params.q) sp.set("q", params.q);
    if (params.page && params.page > 1) sp.set("page", String(params.page));
    const qs = sp.toString();
    return `/berita${qs ? `?${qs}` : ""}`;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Semua Berita</h1>

        {/* Form pencarian */}
        <form action="/berita" method="get" className="mt-4 flex max-w-md gap-2">
          {kategori && <input type="hidden" name="kategori" value={kategori} />}
          <Input name="q" defaultValue={q} placeholder="Cari berita..." />
          <Button type="submit">Cari</Button>
        </form>

        <KategoriChips items={kategoriList ?? []} />

        {kategori && (
          <p className="mt-2 text-sm text-foreground/60">
            Menampilkan kategori: <strong>{kategori}</strong> ·{" "}
            <Link href={buatUrl({ q })} className="text-primary hover:underline">
              Hapus filter
            </Link>
          </p>
        )}

        {beritaList?.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-foreground/50">
            Tidak ada berita yang cocok dengan pencarian.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beritaList?.map((b) => (
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

        {/* Pagination */}
        {totalHalaman > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {halaman > 1 && (
              <Link href={buatUrl({ kategori, q, page: halaman - 1 })}>
                <Button variant="outline" size="sm">← Sebelumnya</Button>
              </Link>
            )}
            <span className="px-3 text-sm text-foreground/60">
              Halaman {halaman} dari {totalHalaman}
            </span>
            {halaman < totalHalaman && (
              <Link href={buatUrl({ kategori, q, page: halaman + 1 })}>
                <Button variant="outline" size="sm">Berikutnya →</Button>
              </Link>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
