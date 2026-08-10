import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PerPageSelect } from "@/components/admin/per-page-select";
import { FileText, Image as ImageIcon, Calendar, FileBadge, Megaphone, Users } from "lucide-react";

const ENTITAS_INFO: Record<string, { label: string; Icon: typeof FileText }> = {
  berita: { label: "Berita", Icon: FileText },
  galeri_album: { label: "Galeri", Icon: ImageIcon },
  agenda: { label: "Agenda", Icon: Calendar },
  dokumen: { label: "Dokumen", Icon: FileBadge },
  pengumuman_banner: { label: "Pengumuman", Icon: Megaphone },
  pengguna: { label: "Pengguna", Icon: Users },
};

const AKSI_WARNA: Record<string, string> = {
  insert: "bg-green-600",
  update: "bg-secondary",
  delete: "bg-red-600",
};

const AKSI_LABEL: Record<string, string> = {
  insert: "Ditambah",
  update: "Diubah",
  delete: "Dihapus",
};

const PILIHAN_PER_HALAMAN = [10, 20, 30, 40, 50, 100];

interface Props {
  searchParams: Promise<{ page?: string; per?: string }>;
}

export default async function LogAktivitasPage({ searchParams }: Props) {
  const { page, per } = await searchParams;

  const perHalaman = PILIHAN_PER_HALAMAN.includes(Number(per)) ? Number(per) : 20;
  const halaman = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const dari = (halaman - 1) * perHalaman;
  const sampai = dari + perHalaman - 1;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") redirect("/admin");

  const { data: logs, count } = await supabase
    .from("log_aktivitas")
    .select("id, aksi, entitas, judul, created_at, pelaku:profiles(nama_lengkap)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(dari, sampai);

  const totalHalaman = Math.max(1, Math.ceil((count ?? 0) / perHalaman));

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Log Aktivitas</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Riwayat perubahan di seluruh sistem — siapa menambah, mengubah, atau menghapus apa. Total {count ?? 0} catatan.
      </p>

      <div className="mt-4 flex items-center justify-between">
        <PerPageSelect current={perHalaman} />
        <span className="text-sm text-foreground/50">
          Halaman {halaman} dari {totalHalaman}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {logs?.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-10 text-center text-foreground/50">
            Belum ada aktivitas tercatat.
          </p>
        )}
        {logs?.map((log) => {
          const info = ENTITAS_INFO[log.entitas] ?? { label: log.entitas, Icon: FileText };
          const Icon = info.Icon;
          return (
            <div key={log.id} className="flex items-center gap-3 rounded-lg border border-border bg-white p-3">
              <Icon className="h-5 w-5 shrink-0 text-foreground/40" />
              <div className="flex-1 text-sm">
                <span className="font-medium">
                  {/* @ts-expect-error - relasi join */}
                  {log.pelaku?.nama_lengkap ?? "Sistem"}
                </span>{" "}
                <Badge className={`${AKSI_WARNA[log.aksi]} mx-1`}>{AKSI_LABEL[log.aksi]}</Badge>
                <span className="text-foreground/50">{info.label.toLowerCase()}:</span>{" "}
                <span className="font-medium">{log.judul}</span>
              </div>
              <span className="shrink-0 text-xs text-foreground/40">
                {new Date(log.created_at).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
      </div>

      {totalHalaman > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {halaman > 1 && (
            <Link href={`/admin/log?page=${halaman - 1}&per=${perHalaman}`}>
              <Button variant="outline" size="sm">← Sebelumnya</Button>
            </Link>
          )}
          <span className="px-3 text-sm text-foreground/60">
            Halaman {halaman} dari {totalHalaman}
          </span>
          {halaman < totalHalaman && (
            <Link href={`/admin/log?page=${halaman + 1}&per=${perHalaman}`}>
              <Button variant="outline" size="sm">Berikutnya →</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
