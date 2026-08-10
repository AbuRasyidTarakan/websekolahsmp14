import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BackupButton } from "@/components/admin/backup-button";
import { Info } from "lucide-react";

export default async function BackupPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") redirect("/admin");

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Backup Data</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Unduh salinan seluruh data website (berita, galeri, agenda, dokumen, dan lainnya) dalam 1 file.
      </p>

      <div className="mt-6 rounded-lg border border-border bg-white p-5">
        <BackupButton />
      </div>

      <div className="mt-6 flex gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm">
        <Info className="h-5 w-5 shrink-0 text-accent" />
        <div className="space-y-2 text-foreground/70">
          <p><strong>Yang termasuk:</strong> semua teks/data dari berita, galeri, agenda, dokumen, FAQ, guru & staf, video, pengumuman, dan log aktivitas.</p>
          <p><strong>Yang TIDAK termasuk:</strong> file gambar/dokumen fisik di Supabase Storage (hanya link-nya yang tersimpan di data), dan data statistik pengunjung.</p>
          <p><strong>Saran:</strong> simpan file hasil backup ini di Google Drive secara berkala (misal sebulan sekali), sesuai rencana pengelolaan yang sudah dibahas sebelumnya.</p>
        </div>
      </div>
    </div>
  );
}
