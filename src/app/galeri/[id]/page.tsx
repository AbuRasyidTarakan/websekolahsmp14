import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailAlbumPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: album } = await supabase
    .from("galeri_album")
    .select("id, judul_album, created_at, galeri_foto(id, url_foto, caption, urutan)")
    .eq("id", id)
    .single();

  if (!album) notFound();

  // @ts-expect-error - relasi array di runtime
  const foto = (album.galeri_foto ?? []).sort((a, b) => a.urutan - b.urutan);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <nav className="text-sm text-foreground/50">
          <Link href="/galeri" className="hover:text-primary">Galeri</Link>
        </nav>

        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{album.judul_album}</h1>
        <p className="mt-1 text-sm text-foreground/50">
          {new Date(album.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {" · "}
          {foto.length} foto
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {foto.map((f: { id: string; url_foto: string; caption: string | null }) => (
            <figure key={f.id} className="overflow-hidden rounded-lg border border-border">
              <div className="relative aspect-square">
                <Image src={f.url_foto} alt={f.caption ?? album.judul_album} fill className="object-cover" />
              </div>
              {f.caption && (
                <figcaption className="p-2 text-xs text-foreground/60">{f.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
