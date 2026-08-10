import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserMenu } from "@/components/admin/user-menu";
import { LogoutButton } from "@/components/admin/logout-button";
import { SidebarProvider } from "@/components/admin/sidebar-context";
import { SidebarToggleButton } from "@/components/admin/sidebar-toggle-button";
import { CollapsibleSidebar } from "@/components/admin/collapsible-sidebar";
import { AdminNavGroup } from "@/components/admin/admin-nav-group";
import { Clock, LayoutDashboard, Newspaper, Users2, BarChart3, Settings } from "lucide-react";

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

  return (
    <SidebarProvider>
      <div data-theme={profile?.tema_preferensi ?? "terang"} className="flex min-h-screen flex-col">
        {/* Top menu */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-white px-4">
          <div className="flex items-center gap-2">
            <SidebarToggleButton />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground">
              14
            </div>
            <span className="font-display text-sm font-bold">Panel Admin — SMP Negeri 14 Tarakan</span>
          </div>

          <UserMenu namaLengkap={profile?.nama_lengkap ?? "Admin"} fotoProfil={profile?.foto_profil ?? null} />
        </header>

        <div className="flex flex-1">
          <CollapsibleSidebar>
            <p className="text-sm text-foreground/70">{profile?.nama_lengkap}</p>
            <p className="text-xs text-foreground/50">{profile?.jabatan}</p>

            <nav className="mt-6 space-y-1 text-sm">
              <Link href="/admin" className="flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-accent/10">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>

              <AdminNavGroup label="Konten" icon={<Newspaper className="h-4 w-4" />} defaultOpen>
                <Link href="/admin/berita" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Kelola Berita</Link>
                <Link href="/admin/berita/baru" className="block rounded-md px-3 py-1.5 pl-12 text-foreground/60 hover:bg-accent/10">↳ Tulis Baru</Link>
                <Link href="/admin/laporan-saya" className="block rounded-md px-3 py-1.5 pl-12 text-foreground/60 hover:bg-accent/10">↳ Laporan Saya</Link>
                <Link href="/admin/galeri" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Kelola Galeri</Link>
                <Link href="/admin/galeri/baru" className="block rounded-md px-3 py-1.5 pl-12 text-foreground/60 hover:bg-accent/10">↳ Album Baru</Link>
                <Link href="/admin/video" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Kelola Video</Link>
                <Link href="/admin/agenda" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Kelola Agenda</Link>
                <Link href="/admin/agenda/baru" className="block rounded-md px-3 py-1.5 pl-12 text-foreground/60 hover:bg-accent/10">↳ Tambah Agenda</Link>
                <Link href="/admin/faq" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Kelola FAQ</Link>
                <Link href="/admin/dokumen" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Download Center</Link>
                <Link href="/admin/pengumuman" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Pengumuman Darurat</Link>
              </AdminNavGroup>

              <AdminNavGroup label="Direktori" icon={<Users2 className="h-4 w-4" />}>
                <Link href="/admin/guru-staff" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Kelola Guru & Staff</Link>
              </AdminNavGroup>

              {profile?.role === "super_admin" && (
                <AdminNavGroup label="Laporan" icon={<BarChart3 className="h-4 w-4" />}>
                  <Link href="/admin/laporan-guru" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Laporan Kontribusi Guru</Link>
                  <Link href="/admin/statistik" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Statistik Pengunjung</Link>
                  <Link href="/admin/log" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Log Aktivitas</Link>
                </AdminNavGroup>
              )}

              {profile?.role === "super_admin" && (
                <AdminNavGroup label="Pengaturan" icon={<Settings className="h-4 w-4" />}>
                  <Link href="/admin/pengaturan/profil-sekolah" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Profil Sekolah</Link>
                  <Link href="/admin/pengaturan/pengguna" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Kelola Pengguna</Link>
                  <Link href="/admin/backup" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Backup Data</Link>
                  <Link href="/admin/restore" className="block rounded-md px-3 py-1.5 pl-8 hover:bg-accent/10">Restore Data</Link>
                </AdminNavGroup>
              )}
            </nav>
          </CollapsibleSidebar>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
