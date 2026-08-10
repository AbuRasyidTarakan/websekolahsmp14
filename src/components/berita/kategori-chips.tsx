import Link from "next/link";
import type { Kategori } from "@/types/database.types";

export function KategoriChips({ items }: { items: Kategori[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((k) => (
          <Link
            key={k.id}
            href={`/berita?kategori=${k.slug}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm font-medium transition-colors hover:text-white"
            style={{ borderColor: k.warna }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: k.warna }}
            />
            {k.nama}
          </Link>
        ))}
      </div>
    </div>
  );
}
