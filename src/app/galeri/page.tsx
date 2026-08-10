import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function GaleriPage() {
  const supabase = await createClient();
  const { data: albumList } = await supabase
    .from("galeri_album")
    .select("id, judul_album, cover_url, created_at, galeri_foto(id)")
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Galeri Kegiatan</h1>

        {albumList?.length === 0 ? (
          <p className="mt-8 text-center text-foreground/50">Belum ada album foto.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {albumList?.map((album) => (
              <Link
                key={album.id}
                href={`/galeri/${album.id}`}
                className="group overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square bg-primary/10">
                  {album.cover_url && (
                    <Image
                      src={album.cover_url}
                      alt={album.judul_album}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold group-hover:text-primary">
                    {album.judul_album}
                  </p>
                  <p className="mt-1 text-xs text-foreground/50">
                    
                    {album.galeri_foto?.length ?? 0} foto
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
