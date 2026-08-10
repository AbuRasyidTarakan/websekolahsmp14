import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getYoutubeEmbedUrl } from "@/lib/youtube-helpers";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailVideoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: video } = await supabase.from("video_kegiatan").select("*").eq("id", id).single();
  if (!video) notFound();

  const embedUrl = getYoutubeEmbedUrl(video.youtube_url);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <nav className="text-sm text-foreground/50">
          <Link href="/video" className="hover:text-primary">Video</Link>
        </nav>

        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{video.judul}</h1>
        <p className="mt-1 text-sm text-foreground/50">
          {new Date(video.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        {embedUrl && (
          <div className="relative mt-6 aspect-video overflow-hidden rounded-lg">
            <iframe
              src={embedUrl}
              title={video.judul}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}

        {video.deskripsi && <p className="mt-4 whitespace-pre-line text-foreground/80">{video.deskripsi}</p>}
      </main>
      <Footer />
    </>
  );
}
