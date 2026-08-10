import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function DaftarBeritaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  let query = supabase
    .from("berita")
    .select("id, judul, slug, status, views, published_at, kategori(nama, warna), penulis:profiles(nama_lengkap)")
    .order("created_at", { ascending: false });

  // Editor biasa hanya lihat berita miliknya; super_admin lihat semua
  if (profile?.role !== "super_admin") {
    query = query.eq("penulis_id", user!.id);
  }

  const { data: beritaList } = await query;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">
          {profile?.role === "super_admin" ? "Semua Berita" : "Berita Saya"}
        </h1>
        <Link href="/admin/berita/baru">
          <Button>+ Tulis Berita Baru</Button>
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-accent/5 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              {profile?.role === "super_admin" && (
                <th className="px-4 py-3 font-medium">Penulis</th>
              )}
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Views</th>
              <th className="px-4 py-3 font-medium">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {beritaList?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground/50">
                  Belum ada berita. Klik &quot;Tulis Berita Baru&quot; untuk mulai menulis.
                </td>
              </tr>
            )}
            {beritaList?.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link href={`/admin/berita/${b.id}`} className="font-medium hover:underline">
                    {b.judul}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {b.kategori && (
                    // @ts-expect-error - relasi join bisa berupa objek tunggal di runtime
                    <Badge style={{ backgroundColor: b.kategori.warna }}>{b.kategori.nama}</Badge>
                  )}
                </td>
                {profile?.role === "super_admin" && (
                  <td className="px-4 py-3 text-foreground/70">
                    {/* @ts-expect-error - relasi join */}
                    {b.penulis?.nama_lengkap}
                  </td>
                )}
                <td className="px-4 py-3">
                  <Badge className={b.status === "published" ? "bg-green-600" : "bg-gray-400"}>
                    {b.status === "published" ? "Terbit" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-foreground/70">{b.views}</td>
                <td className="px-4 py-3 text-foreground/70">
                  {b.published_at ? new Date(b.published_at).toLocaleDateString("id-ID") : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
