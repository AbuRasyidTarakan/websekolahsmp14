import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BeritaCardProps {
  judul: string;
  slug: string;
  ringkasan: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  kategori: { nama: string; warna: string } | null;
  isFeatured?: boolean;
}

export function BeritaCard({
  judul,
  slug,
  ringkasan,
  thumbnail_url,
  published_at,
  kategori,
  isFeatured,
}: BeritaCardProps) {
  return (
    <Link
      href={`/berita/${slug}`}
      className={cn(
        "group block overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-lg",
        isFeatured && "mading-fold"
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-primary/10">
        {thumbnail_url ? (
          <Image
            src={thumbnail_url}
            alt={judul}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-2xl text-primary/30">
            SMPN 14
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs">
          {kategori && (
            <span
              className="rounded-full px-2.5 py-0.5 font-semibold text-white"
              style={{ backgroundColor: kategori.warna }}
            >
              {kategori.nama}
            </span>
          )}
          {published_at && (
            <span className="text-foreground/50">
              {new Date(published_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        <h3 className="mt-2 font-display text-base font-semibold leading-snug group-hover:text-primary">
          {judul}
        </h3>

        {ringkasan && (
          <p className="mt-1.5 line-clamp-2 text-sm text-foreground/60">{ringkasan}</p>
        )}
      </div>
    </Link>
  );
}
