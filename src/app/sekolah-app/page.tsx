import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSekolahApps } from "@/lib/sekolah-app";
import { domainDari, urlAman } from "@/lib/sekolah-app-url";
import { ArrowUpRight, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
  title: "Sekolah App",
  description: "Kumpulan aplikasi dan layanan digital SMP Negeri 14 Tarakan.",
};

export default async function SekolahAppPage() {
  const apps = await getSekolahApps();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Sekolah App</h1>
        <p className="mt-2 text-foreground/60">Kumpulan aplikasi dan layanan digital SMP Negeri 14 Tarakan.</p>

        {apps.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-foreground/50">
            Belum ada aplikasi yang ditampilkan.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <a
                key={app.id}
                href={urlAman(app.url) ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-foreground/30 transition-colors group-hover:text-primary" />
                </div>
                <p className="mt-4 font-display text-lg font-bold text-slate-900">{app.nama}</p>
                {app.deskripsi && <p className="mt-1 flex-1 text-sm text-slate-500">{app.deskripsi}</p>}
                <p className="mt-3 text-xs text-primary">{domainDari(app.url)}</p>
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
