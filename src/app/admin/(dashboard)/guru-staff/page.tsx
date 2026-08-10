import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PER_HALAMAN = 16;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function KelolaGuruStaffPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const halaman = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const dari = (halaman - 1) * PER_HALAMAN;
  const sampai = dari + PER_HALAMAN - 1;

  const supabase = await createClient();
  const { data: daftar, count } = await supabase
    .from("guru_staff")
    .select("*", { count: "exact" })
    .order("urutan", { ascending: true })
    .range(dari, sampai);

  const totalHalaman = Math.max(1, Math.ceil((count ?? 0) / PER_HALAMAN));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Kelola Guru & Staff</h1>
        <Link href="/admin/guru-staff/baru">
          <Button>+ Tambah Guru/Staff</Button>
        </Link>
      </div>
      <p className="mt-1 text-sm text-foreground/60">
        Direktori ini terpisah dari akun login — bisa menambahkan guru/staf yang tidak punya akses ke website ini.
        {count ? ` Total ${count} data.` : ""}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {daftar?.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-foreground/50">
            Belum ada data.
          </p>
        )}
        {daftar?.map((g) => (
          <Link
            key={g.id}
            href={`/admin/guru-staff/${g.id}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-white p-3 hover:border-primary"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/10">
              {g.foto_url && <Image src={g.foto_url} alt={g.nama_lengkap} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-medium">{g.nama_lengkap}</p>
              <p className="text-xs text-foreground/50">{g.jabatan}</p>
            </div>
            {!g.is_active && <Badge className="bg-gray-400">Nonaktif</Badge>}
          </Link>
        ))}
      </div>

      {totalHalaman > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {halaman > 1 && (
            <Link href={`/admin/guru-staff?page=${halaman - 1}`}>
              <Button variant="outline" size="sm">← Sebelumnya</Button>
            </Link>
          )}
          <span className="px-3 text-sm text-foreground/60">
            Halaman {halaman} dari {totalHalaman}
          </span>
          {halaman < totalHalaman && (
            <Link href={`/admin/guru-staff?page=${halaman + 1}`}>
              <Button variant="outline" size="sm">Berikutnya →</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
