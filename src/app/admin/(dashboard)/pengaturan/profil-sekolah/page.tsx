import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfilSekolahForm } from "@/components/admin/profil-sekolah-form";
import { StrukturOrganisasiEditor } from "@/components/admin/struktur-organisasi-editor";

export default async function EditProfilSekolahPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") redirect("/admin");

  const { data: profil } = await supabase.from("profil_sekolah").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Edit Profil Sekolah</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Data ini tampil di halaman publik <code>/profil-sekolah</code>.
      </p>
      <ProfilSekolahForm
        initialData={{
          nama_sekolah: profil?.nama_sekolah ?? "",
          npsn: profil?.npsn ?? "",
          deskripsi_singkat: profil?.deskripsi_singkat ?? "",
          visi: profil?.visi ?? "",
          misi: Array.isArray(profil?.misi) ? profil.misi.join("\n") : "",
          sejarah: profil?.sejarah ?? "",
          alamat: profil?.alamat ?? "",
          telepon: profil?.telepon ?? "",
          email: profil?.email ?? "",
          instagram_url: profil?.instagram_url ?? "",
          facebook_url: profil?.facebook_url ?? "",
          youtube_url: profil?.youtube_url ?? "",
          logo_url: profil?.logo_url ?? null,
        }}
      />

      <StrukturOrganisasiEditor
        initialData={Array.isArray(profil?.struktur_organisasi) ? profil.struktur_organisasi : []}
      />
    </div>
  );
}
