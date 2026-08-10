import { createClient } from "@/lib/supabase/server";
import { DokumenForm } from "@/components/admin/dokumen-form";
import { DokumenList } from "@/components/admin/dokumen-list";
import { SimpleTabs } from "@/components/admin/simple-tabs";

export default async function KelolaDokumenPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();

  let query = supabase
    .from("dokumen")
    .select("id, judul, deskripsi, kategori, file_url, file_name, file_size, created_at, penulis_id")
    .order("created_at", { ascending: false });

  if (profile?.role !== "super_admin") {
    query = query.eq("penulis_id", user!.id);
  }

  const { data: dokumenList } = await query;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Download Center</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Kelola dokumen resmi seperti kalender akademik, formulir, dan tata tertib yang bisa diunduh publik.
      </p>

      <div className="mt-6">
        <SimpleTabs
          tabs={[
            {
              label: "Download Center",
              content: (
                <section className="rounded-lg border border-border bg-white p-5">
                  <h2 className="font-display text-lg font-bold">Upload Dokumen Baru</h2>
                  <DokumenForm />
                </section>
              ),
            },
            {
              label: "Semua Dokumen",
              content: (
                <DokumenList
                  items={dokumenList ?? []}
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
