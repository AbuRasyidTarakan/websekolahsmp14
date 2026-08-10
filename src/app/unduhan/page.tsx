import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FileText, Download } from "lucide-react";
import type { Dokumen, KategoriDokumen } from "@/types/database.types";

function formatUkuran(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const URUTAN_KATEGORI: KategoriDokumen[] = ["Kalender Akademik", "Formulir", "Tata Tertib", "Surat Edaran", "Lainnya"];

export default async function UnduhanPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("dokumen").select("*").order("created_at", { ascending: false });
  const dokumenList = (data ?? []) as Dokumen[];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Download Center</h1>
        <p className="mt-2 text-foreground/60">Dokumen resmi sekolah yang bisa diunduh langsung.</p>

        {dokumenList.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-foreground/50">
            Belum ada dokumen yang diunggah.
          </p>
        ) : (
          URUTAN_KATEGORI.map((kategori) => {
            const items = dokumenList.filter((d) => d.kategori === kategori);
            if (items.length === 0) return null;

            return (
              <section key={kategori} className="mt-8">
                <h2 className="font-display text-lg font-bold text-primary">{kategori}</h2>
                <div className="mt-3 space-y-2">
                  {items.map((d) => (
                    <a
                      key={d.id}
                      href={d.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-primary"
                    >
                      <FileText className="h-8 w-8 shrink-0 text-primary/60" />
                      <div className="flex-1">
                        <p className="font-medium">{d.judul}</p>
                        {d.deskripsi && <p className="mt-0.5 text-sm text-foreground/60">{d.deskripsi}</p>}
                        <p className="mt-0.5 text-xs text-foreground/40">{formatUkuran(d.file_size)}</p>
                      </div>
                      <Download className="h-5 w-5 shrink-0 text-foreground/40" />
                    </a>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>
      <Footer />
    </>
  );
}
