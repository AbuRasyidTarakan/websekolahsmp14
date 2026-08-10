import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BeritaCard } from "@/components/berita/berita-card";
import { getYoutubeEmbedUrl } from "@/lib/youtube-helpers";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBerita(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("berita")
    .select(
      "id, judul, slug, ringkasan, konten, thumbnail_url, video_url, views, published_at, kategori(id, nama, warna), penulis:profiles(nama_lengkap, jabatan)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const berita = await getBerita(slug);
  if (!berita) return { title: "Berita Tidak Ditemukan" };

  return {
    title: berita.judul,
    description: berita.ringkasan ?? undefined,
    openGraph: {
      title: berita.judul,
      description: berita.ringkasan ?? undefined,
      images: berita.thumbnail_url ? [berita.thumbnail_url] : undefined,
      type: "article",
    },
  };
}

export default async function DetailBeritaPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const berita = await getBerita(slug);

  if (!berita) notFound();

  // Tambah jumlah views (fire-and-forget, tidak menghambat render halaman)
  supabase.rpc("increment_berita_views", { berita_id: berita.id }).then(() => {});

  // @ts-expect-error - relasi join berupa objek tunggal di runtime
  const kategori = berita.kategori as { id: string; nama: string; warna: string } | null;
  // @ts-expect-error - relasi join
  const penulis = berita.penulis as { nama_lengkap: string; jabatan: string | null } | null;

  const { data: terkait } = kategori
    ? await supabase
        .from("berita")
        .select("id, judul, slug, ringkasan, thumbnail_url, published_at, kategori(nama, warna)")
        .eq("status", "published")
        .eq("kategori_id", kategori.id)
        .neq("id", berita.id)
        .order("published_at", { ascending: false })
        .limit(3)
    : { data: [] };

  const shareUrl = encodeURIComponent(
    `https://smpn14tarakan.sch.id/berita/${berita.slug}`
  );
  const shareText = encodeURIComponent(berita.judul);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-foreground/50">
          <Link href="/" className="hover:text-primary">Beranda</Link>
          {" > "}
          <Link href="/berita" className="hover:text-primary">Berita</Link>
          {kategori && (
            <>
              {" > "}
              <Link href={`/berita?kategori=${kategori.nama}`} className="hover:text-primary">
                {kategori.nama}
              </Link>
            </>
          )}
        </nav>

        {kategori && (
          <span
            className="mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: kategori.warna }}
          >
            {kategori.nama}
          </span>
        )}

        <h1 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          {berita.judul}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/60">
          {penulis && (
            <span>
              Oleh <strong>{penulis.nama_lengkap}</strong>
              {penulis.jabatan && ` · ${penulis.jabatan}`}
            </span>
          )}
          {berita.published_at && (
            <span>
              {new Date(berita.published_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
          <span>{berita.views + 1} kali dibaca</span>
        </div>

        {berita.thumbnail_url && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg">
            <Image src={berita.thumbnail_url} alt={berita.judul} fill className="object-cover" priority />
          </div>
        )}

        {berita.video_url && getYoutubeEmbedUrl(berita.video_url) && (
          <div className="relative mt-6 aspect-video overflow-hidden rounded-lg">
            <iframe
              src={getYoutubeEmbedUrl(berita.video_url)!}
              title="Video berita"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}

        <article
          className="prose prose-sm mt-6 max-w-none sm:prose-base prose-headings:font-display prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: berita.konten }}
        />

        {/* Share ke WhatsApp — sesuai kebiasaan orang tua Indonesia */}
        <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
          <span className="text-sm font-medium">Bagikan:</span>
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700"
          >
            WhatsApp
          </a>
        </div>
      </main>

      {terkait && terkait.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <h2 className="font-display text-xl font-bold">Berita Terkait</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {terkait.map((b) => (
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
        </section>
      )}

      <Footer />
    </>
  );
}
