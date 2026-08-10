import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function ProfilSekolahPage() {
  const supabase = await createClient();
  const { data: profil } = await supabase.from("profil_sekolah").select("*").eq("id", 1).single();

  const misi: string[] = Array.isArray(profil?.misi) ? profil.misi : [];
  const struktur: { nama: string; jabatan: string; foto_url?: string }[] = Array.isArray(
    profil?.struktur_organisasi
  )
    ? profil.struktur_organisasi
    : [];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center gap-4">
          {profil?.logo_url && (
            <div className="relative h-16 w-16 shrink-0">
              <Image src={profil.logo_url} alt="Logo Sekolah" fill className="object-contain" />
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              {profil?.nama_sekolah ?? "Profil Sekolah"}
            </h1>
            {profil?.npsn && <p className="text-sm text-foreground/60">NPSN: {profil.npsn}</p>}
          </div>
        </div>

        {profil?.sejarah && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold">Sejarah</h2>
            <p className="mt-2 whitespace-pre-line text-foreground/80">{profil.sejarah}</p>
          </section>
        )}

        {(profil?.visi || misi.length > 0) && (
          <section className="mt-8 space-y-6">
            {profil?.visi && (
              <div className="rounded-lg border border-border bg-white p-5">
                <h2 className="font-display text-lg font-bold text-primary">Visi</h2>
                <p className="mt-2 text-sm text-foreground/80">{profil.visi}</p>
              </div>
            )}
            {misi.length > 0 && (
              <div className="rounded-lg border border-border bg-white p-5">
                <h2 className="font-display text-lg font-bold text-primary">Misi</h2>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-foreground/80">
                  {misi.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ol>
              </div>
            )}
          </section>
        )}

        {struktur.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold">Struktur Organisasi</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {struktur.map((s, i) => (
                <div key={i} className="rounded-lg border border-border bg-white p-4 text-center">
                  <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full bg-primary/10">
                    {s.foto_url && <Image src={s.foto_url} alt={s.nama} fill className="object-cover" />}
                  </div>
                  <p className="mt-2 text-sm font-semibold">{s.nama}</p>
                  <p className="text-xs text-foreground/60">{s.jabatan}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(profil?.alamat || profil?.telepon || profil?.email) && (
          <section className="mt-8 rounded-lg border border-border bg-white p-5">
            <h2 className="font-display text-lg font-bold">Kontak</h2>
            <ul className="mt-2 space-y-1 text-sm text-foreground/80">
              {profil?.alamat && <li>{profil.alamat}</li>}
              {profil?.telepon && <li>{profil.telepon}</li>}
              {profil?.email && <li>{profil.email}</li>}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
