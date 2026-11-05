import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { UserMenu } from "@/components/admin/user-menu";
import { LogoutButton } from "@/components/admin/logout-button";
import { SidebarProvider } from "@/components/admin/sidebar-context";
import { SidebarToggleButton } from "@/components/admin/sidebar-toggle-button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/admin/theme-toggle";

const LABEL_PERAN: Record<string, string> = {
  super_admin: "Super Admin",
  editor: "Editor",
  staf_tu: "Staf TU",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Halaman login sendiri tidak dibungkus layout ini (lihat src/app/admin/login/page.tsx
  // yang route-nya terpisah dari proteksi ini lewat middleware matcher)
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama_lengkap, role, jabatan, foto_profil, tema_preferensi, is_active")
    .eq("id", user.id)
    .single();

  // Fail-safe: kalau baris profiles TIDAK ADA sama sekali (misal trigger gagal)
  // ATAU is_active-nya false, tetap diblokir. Jangan pernah meloloskan kalau
  // data profile tidak jelas/tidak lengkap.
  if (!profile || !profile.is_active) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm rounded-lg border border-border bg-white p-6 text-center">
          <Clock className="mx-auto h-10 w-10 text-accent" />
          <h1 className="mt-3 font-display text-lg font-bold">Menunggu Persetujuan</h1>
          <p className="mt-2 text-sm text-foreground/60">
            {profile
              ? `Akun Anda (${profile.nama_lengkap}) sudah terdaftar, tapi belum diaktifkan oleh admin sekolah. Silakan hubungi admin, atau tunggu konfirmasi.`
              : "Data akun Anda belum lengkap. Silakan hubungi admin sekolah."}
          </p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  const isSuperAdmin = profile.role === "super_admin";

  return (
    <SidebarProvider>
      <div data-theme={profile.tema_preferensi ?? "terang"} className="flex h-screen overflow-hidden bg-background text-foreground">
        <AdminSidebar isSuperAdmin={isSuperAdmin} />

        <div className="flex h-full min-w-0 flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-chrome-border bg-chrome-bg px-4 text-chrome-strong sm:px-6">
            <SidebarToggleButton />
            <div className="flex items-center gap-1">
              <ThemeToggle temaSaatIni={profile.tema_preferensi ?? "terang"} />
              <UserMenu
                namaLengkap={profile.nama_lengkap ?? "Admin"}
                fotoProfil={profile.foto_profil ?? null}
                peran={LABEL_PERAN[profile.role] ?? profile.role}
              />
            </div>
          </header>

          <main className="scroll-samar min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
