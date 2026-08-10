import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function GuruStaffPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guru_staff")
    .select("id, nama_lengkap, jabatan, mata_pelajaran, foto_url")
    .eq("is_active", true)
    .order("urutan", { ascending: true });

  const daftar = data ?? [];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Guru & Staff</h1>
        <p className="mt-2 text-foreground/60">Jajaran guru dan staf SMP Negeri 14 Tarakan.</p>

        {daftar.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-foreground/50">
            Belum ada data yang ditampilkan.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {daftar.map((g) => (
              <div key={g.id} className="rounded-lg border border-border bg-white p-4 text-center">
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full bg-primary/10">
                  {g.foto_url ? (
                    <Image src={g.foto_url} alt={g.nama_lengkap} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-2xl text-primary/40">
                      {g.nama_lengkap.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="mt-3 font-semibold">{g.nama_lengkap}</p>
                <p className="text-sm text-foreground/60">{g.jabatan}</p>
                {g.mata_pelajaran && <p className="text-xs text-foreground/40">{g.mata_pelajaran}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
