import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Image as ImageIcon, Users, TrendingUp } from "lucide-react";

function tanggalWita(offsetHari = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetHari);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Makassar" });
}

function StatCard({
  icon,
  label,
  value,
  note,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  note?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-slate-800 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      {note && <p className="mt-1 text-xs text-slate-400">{note}</p>}
      {link && (
        <Link href={link.href} className="mt-1 inline-block text-xs text-primary hover:underline">
          {link.label}
        </Link>
      )}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("role, nama_lengkap").eq("id", user!.id).single();
  const isSuperAdmin = profile?.role === "super_admin";

  let beritaQuery = supabase.from("berita").select("id, judul, slug, status, views, published_at, created_at");
  if (!isSuperAdmin) beritaQuery = beritaQuery.eq("penulis_id", user!.id);
  const { data: semuaBerita } = await beritaQuery.order("created_at", { ascending: false });

  const totalBerita = semuaBerita?.length ?? 0;
  const totalPublished = semuaBerita?.filter((b) => b.status === "published").length ?? 0;
  const totalDraft = totalBerita - totalPublished;
  const totalViews = semuaBerita?.reduce((sum, b) => sum + (b.views ?? 0), 0) ?? 0;
  const beritaTerbaru = semuaBerita?.slice(0, 5) ?? [];

  let pengunjungHariIni: number | null = null;
  let logTerbaru: { id: string; aksi: string; entitas: string; judul: string | null; created_at: string; pelaku: { nama_lengkap: string } | null }[] = [];
  let totalAlbum = 0;

  if (isSuperAdmin) {
    const { data: kunjunganHariIni } = await supabase
      .from("kunjungan")
      .select("visitor_id")
      .eq("tanggal_wita", tanggalWita(0));
    pengunjungHariIni = new Set((kunjunganHariIni ?? []).map((k) => k.visitor_id)).size;

    const { data: logs } = await supabase
      .from("log_aktivitas")
      .select("id, aksi, entitas, judul, created_at, pelaku:profiles(nama_lengkap)")
      .order("created_at", { ascending: false })
      .limit(5);
    // @ts-expect-error - relasi join
    logTerbaru = logs ?? [];

    const { count } = await supabase.from("galeri_album").select("id", { count: "exact", head: true });
    totalAlbum = count ?? 0;
  }

  const AKSI_LABEL: Record<string, string> = { insert: "menambah", update: "mengubah", delete: "menghapus" };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">
        Halo, {profile?.nama_lengkap?.split(" ")[0] ?? "Admin"} 👋
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        {isSuperAdmin ? "Ringkasan seluruh aktivitas website." : "Ringkasan berita yang Anda kelola."}
      </p>

      <div className={`mt-6 grid grid-cols-2 gap-4 ${isSuperAdmin ? "lg:grid-cols-4" : "sm:grid-cols-3"}`}>
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label={isSuperAdmin ? "Total Berita" : "Berita Saya"}
          value={totalBerita}
          note={`${totalPublished} terbit · ${totalDraft} draft`}
        />
        <StatCard
          icon={<Eye className="h-5 w-5" />}
          label="Total Views"
          value={totalViews.toLocaleString("id-ID")}
        />
        {isSuperAdmin && (
          <>
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Pengunjung Hari Ini"
              value={pengunjungHariIni ?? 0}
              link={{ href: "/admin/statistik", label: "Lihat detail →" }}
            />
            <StatCard icon={<ImageIcon className="h-5 w-5" />} label="Album Galeri" value={totalAlbum} />
          </>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-slate-800">
        <div className="flex items-center justify-between">
          <p className="font-display font-bold">{isSuperAdmin ? "Berita Terbaru" : "Berita Saya Terbaru"}</p>
          <Link href="/admin/berita" className="text-sm text-primary hover:underline">Lihat semua →</Link>
        </div>
        <div className="mt-3 space-y-2">
          {beritaTerbaru.length === 0 && <p className="text-sm text-foreground/40">Belum ada berita.</p>}
          {beritaTerbaru.map((b) => (
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

      {isSuperAdmin && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-slate-800">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-display font-bold">
              <TrendingUp className="h-4 w-4" /> Aktivitas Terbaru
            </p>
            <Link href="/admin/log" className="text-sm text-primary hover:underline">Lihat semua →</Link>
          </div>
          <div className="mt-3 space-y-1.5">
            {logTerbaru.length === 0 && <p className="text-sm text-foreground/40">Belum ada aktivitas.</p>}
            {logTerbaru.map((log) => (
              <p key={log.id} className="text-sm text-foreground/70">
                <span className="font-medium text-foreground">{log.pelaku?.nama_lengkap ?? "Sistem"}</span>{" "}
                {AKSI_LABEL[log.aksi]} {log.entitas}: <span className="italic">{log.judul}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
