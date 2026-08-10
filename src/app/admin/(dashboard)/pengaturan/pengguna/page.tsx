import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { UserList } from "@/components/admin/user-list";
import { ToggleRegistrasi } from "@/components/admin/toggle-registrasi";
import { PenggunaTabs } from "@/components/admin/pengguna-tabs";

export default async function KelolaPenggunaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") redirect("/admin");

  const { data: profilSekolah } = await supabase
    .from("profil_sekolah")
    .select("pendaftaran_editor_terbuka")
    .eq("id", 1)
    .single();

  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("*")
    .order("is_active", { ascending: true })
    .order("created_at", { ascending: false });

  const jumlahMenunggu = (allProfiles ?? []).filter((p) => !p.is_active).length;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Kelola Pengguna</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Tambah akun guru baru, atur pendaftaran mandiri, atau kelola akun yang sudah ada.
      </p>

      <div className="mt-6">
        <PenggunaTabs
          tabKelola={
            <div className="space-y-6">
              <ToggleRegistrasi terbukaAwal={profilSekolah?.pendaftaran_editor_terbuka ?? false} />

              <section className="rounded-lg border border-border bg-white p-5">
                <h2 className="font-display text-lg font-bold">Tambah Guru Baru</h2>
                <CreateUserForm />
              </section>
            </div>
          }
          tabSemua={
            <div>
              {jumlahMenunggu > 0 && (
                <p className="mb-3 rounded-md bg-accent/10 px-3 py-2 text-sm text-accent">
                  {jumlahMenunggu} akun menunggu persetujuan.
                </p>
              )}
              <UserList profiles={allProfiles ?? []} currentUserId={user.id} />
            </div>
          }
        />
      </div>
    </div>
  );
}
