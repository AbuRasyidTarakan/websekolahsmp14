import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getYoutubeThumbnail } from "@/lib/youtube-helpers";
import { PlayCircle } from "lucide-react";

export default async function VideoPage() {
  const supabase = await createClient();
  const { data: videoList } = await supabase
    .from("video_kegiatan")
    .select("id, judul, deskripsi, youtube_url, created_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Video Kegiatan</h1>

        {videoList?.length === 0 ? (
          <p className="mt-10 text-center text-foreground/50">Belum ada video.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videoList?.map((v) => {
              const thumb = getYoutubeThumbnail(v.youtube_url);
              return (
                <Link
                  key={v.id}
                  href={`/video/${v.id}`}
                  className="group overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-video bg-black/10">
                    {thumb && (
                      <Image src={thumb} alt={v.judul} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    )}
                    <PlayCircle className="absolute inset-0 m-auto h-12 w-12 text-white drop-shadow-lg" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold group-hover:text-primary">{v.judul}</p>
                    {v.deskripsi && <p className="mt-1 line-clamp-2 text-sm text-foreground/60">{v.deskripsi}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
