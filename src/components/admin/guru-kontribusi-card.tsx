"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BeritaRingkas {
  id: string;
  judul: string;
  status: string;
  views: number;
}

interface GuruKontribusi {
  penulisId: string;
  nama: string;
  jabatan: string | null;
  totalBerita: number;
  totalPublished: number;
  totalViews: number;
  daftarBerita: BeritaRingkas[];
}

export function GuruKontribusiCard({ data }: { data: GuruKontribusi }) {
  const [terbuka, setTerbuka] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-white">
      <button onClick={() => setTerbuka((t) => !t)} className="flex w-full items-center justify-between gap-4 p-4 text-left">
        <div>
          <p className="font-semibold">{data.nama}</p>
          <p className="text-xs text-foreground/50">{data.jabatan}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="font-display font-bold text-primary">{data.totalBerita}</p>
            <p className="text-[10px] text-foreground/40">Berita</p>
          </div>
          <div className="text-center">
            <p className="font-display font-bold">{data.totalViews.toLocaleString("id-ID")}</p>
            <p className="text-[10px] text-foreground/40">Views</p>
          </div>
          <ChevronDown className={`h-4 w-4 text-foreground/40 transition-transform ${terbuka ? "rotate-180" : ""}`} />
        </div>
      </button>

      {terbuka && (
        <div className="border-t border-border p-4">
          {data.daftarBerita.length === 0 ? (
            <p className="text-sm text-foreground/40">Belum ada berita.</p>
          ) : (
            <div className="space-y-1">
              {data.daftarBerita.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/berita/${b.id}`}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent/5"
                >
                  <span className="truncate">{b.judul}</span>
                  <span className="ml-3 flex shrink-0 items-center gap-3">
                    <Badge className={b.status === "published" ? "bg-green-600" : "bg-gray-400"}>
                      {b.status === "published" ? "Terbit" : "Draft"}
                    </Badge>
                    <span className="flex items-center gap-1 text-foreground/40">
                      <Eye className="h-3.5 w-3.5" /> {b.views}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
