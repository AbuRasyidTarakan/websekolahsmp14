import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfilSayaForm } from "@/components/admin/profil-saya-form";
import { ThemeSwitcher } from "@/components/admin/theme-switcher";

export default async function ProfilSayaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama_lengkap, jabatan, foto_profil, email, tema_preferensi")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-bold">Profil Saya</h1>
      <p className="mt-1 text-sm text-foreground/60">Data ini tampil juga di halaman publik Guru & Staff.</p>

      <ProfilSayaForm
        initialData={{
          nama_lengkap: profile?.nama_lengkap ?? "",
          jabatan: profile?.jabatan ?? "",
          foto_profil: profile?.foto_profil ?? null,
          email: profile?.email ?? "",
        }}
      />

      <div className="mt-10">
        <h2 className="font-display text-lg font-bold">Tampilan Panel Admin</h2>
        <p className="mt-1 text-sm text-foreground/60">Pilih warna yang paling nyaman untuk mata Anda.</p>
        <div className="mt-4">
          <ThemeSwitcher temaSaatIni={profile?.tema_preferensi ?? "terang"} />
        </div>
      </div>
    </div>
  );
}
