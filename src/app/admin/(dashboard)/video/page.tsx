import { createClient } from "@/lib/supabase/server";
import { VideoForm } from "@/components/admin/video-form";
import { VideoList } from "@/components/admin/video-list";
import { SimpleTabs } from "@/components/admin/simple-tabs";

export default async function KelolaVideoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();

  let query = supabase
    .from("video_kegiatan")
    .select("id, judul, deskripsi, youtube_url, created_at, penulis_id")
    .order("created_at", { ascending: false });

  if (profile?.role !== "super_admin") {
    query = query.eq("penulis_id", user!.id);
  }

  const { data: videoList } = await query;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Kelola Video</h1>
      <p className="mt-1 text-sm text-foreground/60">Video kegiatan sekolah dari YouTube.</p>

      <div className="mt-6">
        <SimpleTabs
          tabs={[
            {
              label: "Kelola Video",
              content: (
                <section className="rounded-lg border border-border bg-white p-5">
                  <h2 className="font-display text-lg font-bold">Tambah Video</h2>
                  <VideoForm />
                </section>
              ),
            },
            {
              label: "Semua Video",
              content: (
                <VideoList
                  items={videoList ?? []}
                  currentUserId={user!.id}
                  isSuperAdmin={profile?.role === "super_admin"}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
