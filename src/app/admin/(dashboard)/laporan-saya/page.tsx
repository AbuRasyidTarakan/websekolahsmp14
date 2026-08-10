import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Eye, FileText, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function LaporanSayaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("nama_lengkap, jabatan").eq("id", user.id).single();

  const { data: beritaSaya } = await supabase
    .from("berita")
    .select("id, judul, status, views, published_at, created_at")
    .eq("penulis_id", user.id)
    .order("created_at", { ascending: false });

  const daftar = beritaSaya ?? [];
  const totalBerita = daftar.length;
  const totalPublished = daftar.filter((b) => b.status === "published").length;
  const totalDraft = totalBerita - totalPublished;
  const totalViews = daftar.reduce((sum, b) => sum + (b.views ?? 0), 0);
  const beritaTerpopuler = [...daftar].sort((a, b) => b.views - a.views)[0];

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Laporan Saya</h1>
      <p className="mt-1 text-sm text-foreground/60">
        {profile?.nama_lengkap} · {profile?.jabatan}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center gap-2 text-foreground/50">
            <FileText className="h-4 w-4" />
            <p className="text-sm">Total Berita</p>
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-primary">{totalBerita}</p>
          <p className="mt-1 text-xs text-foreground/40">{totalPublished} terbit · {totalDraft} draft</p>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="flex items-center gap-2 text-foreground/50">
            <Eye className="h-4 w-4" />
            <p className="text-sm">Total Views</p>
          </div>
          <p className="mt-2 font-display text-3xl font-bold">{totalViews.toLocaleString("id-ID")}</p>
        </div>

        {beritaTerpopuler && (
          <div className="rounded-lg border border-border bg-white p-5">
            <div className="flex items-center gap-2 text-foreground/50">
              <TrendingUp className="h-4 w-4" />
              <p className="text-sm">Berita Terpopuler</p>
            </div>
            <p className="mt-2 line-clamp-2 text-sm font-semibold">{beritaTerpopuler.judul}</p>
            <p className="mt-1 text-xs text-foreground/40">{beritaTerpopuler.views} views</p>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-white p-5">
        <p className="font-display font-bold">Semua Berita Saya</p>
        <div className="mt-3 space-y-1">
          {daftar.length === 0 && <p className="text-sm text-foreground/40">Belum ada berita yang ditulis.</p>}
          {daftar.map((b) => (
            <Link
              key={b.id}
              href={`/admin/berita/${b.id}`}
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent/5"
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
      </div>
    </div>
  );
}
