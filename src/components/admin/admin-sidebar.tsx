"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Newspaper, Images, Video, CalendarDays, HelpCircle, Download, Megaphone,
  ClipboardList, Contact, UserCog, BarChart3, ScrollText, Building2, Users2, DatabaseBackup,
  ArchiveRestore, PenSquare, Globe, LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSidebar } from "@/components/admin/sidebar-context";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; Icon: LucideIcon };
type Section = { label: string | null; items: Item[]; superAdminOnly?: boolean };

// Susunan menu: dikelompokkan per kategori (label kecil huruf kapital), bukan
// akordeon — semua menu langsung kelihatan tanpa harus klik buka-tutup dulu.
const SECTIONS: Section[] = [
  {
    label: null,
    items: [{ href: "/admin", label: "Dashboard", Icon: LayoutDashboard }],
  },
  {
    label: "Konten",
    items: [
      { href: "/admin/berita", label: "Kelola Berita", Icon: Newspaper },
      { href: "/admin/laporan-saya", label: "Laporan Saya", Icon: ClipboardList },
      { href: "/admin/galeri", label: "Kelola Galeri", Icon: Images },
      { href: "/admin/video", label: "Kelola Video", Icon: Video },
      { href: "/admin/agenda", label: "Kelola Agenda", Icon: CalendarDays },
      { href: "/admin/faq", label: "Kelola FAQ", Icon: HelpCircle },
      { href: "/admin/dokumen", label: "Download Center", Icon: Download },
      { href: "/admin/pengumuman", label: "Pengumuman Darurat", Icon: Megaphone },
    ],
  },
  {
    label: "Direktori",
    items: [{ href: "/admin/guru-staff", label: "Guru & Staff", Icon: Contact }],
  },
  {
    label: "Laporan",
    superAdminOnly: true,
    items: [
      { href: "/admin/laporan-guru", label: "Kontribusi Guru", Icon: UserCog },
      { href: "/admin/statistik", label: "Statistik Pengunjung", Icon: BarChart3 },
      { href: "/admin/log", label: "Log Aktivitas", Icon: ScrollText },
    ],
  },
  {
    label: "Pengaturan",
    superAdminOnly: true,
    items: [
      { href: "/admin/pengaturan/profil-sekolah", label: "Profil Sekolah", Icon: Building2 },
      { href: "/admin/pengaturan/pengguna", label: "Kelola Pengguna", Icon: Users2 },
      { href: "/admin/sekolah-app", label: "Sekolah App", Icon: LayoutGrid },
      { href: "/admin/backup", label: "Backup Data", Icon: DatabaseBackup },
      { href: "/admin/restore", label: "Restore Data", Icon: ArchiveRestore },
    ],
  },
];

export function AdminSidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const { terbuka } = useSidebar();
  const collapsed = !terbuka;

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center rounded-lg text-sm font-medium transition-colors",
      collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2",
      active ? "bg-chrome-active-bg text-chrome-active-fg" : "text-chrome-fg hover:bg-chrome-hover hover:text-chrome-strong"
    );

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 shrink-0 flex-col border-r border-chrome-border bg-chrome-bg text-chrome-fg transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo + nama sekolah */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-chrome-border",
          collapsed ? "justify-center" : "gap-2.5 px-5"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-display text-xs font-bold text-primary-foreground">
          14
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-semibold text-chrome-strong">SMP Negeri 14</p>
            <p className="text-[11px] text-chrome-muted">Panel Admin</p>
          </div>
        )}
      </div>

      <nav className={cn("scroll-samar min-h-0 flex-1 space-y-1 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
        {/* Tombol aksi utama: guru paling sering menulis berita */}
        <Link
          href="/admin/berita/baru"
          title="Tulis Berita"
          className={cn(
            "mb-3 flex items-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90",
            collapsed ? "justify-center py-2.5" : "gap-2.5 px-3 py-2.5"
          )}
        >
          <PenSquare className="h-4 w-4 shrink-0" />
          {!collapsed && "Tulis Berita"}
        </Link>

        {SECTIONS.filter((s) => !s.superAdminOnly || isSuperAdmin).map((section, i) => (
          <div key={section.label ?? `s-${i}`}>
            {section.label &&
              (collapsed ? (
                <div className="my-2 border-t border-chrome-border" title={section.label} />
              ) : (
                <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-chrome-muted">
                  {section.label}
                </p>
              ))}
            <div className="space-y-1">
              {section.items.map(({ href, label, Icon }) => (
                <Link key={href} href={href} title={label} className={linkClass(isActive(href))}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Pintasan ke website publik */}
      <div className={cn("shrink-0 border-t border-chrome-border py-3", collapsed ? "px-2" : "px-3")}>
        <Link
          href="/"
          target="_blank"
          title="Lihat Website"
          className={cn(
            "flex items-center rounded-lg text-sm font-medium text-chrome-fg transition-colors hover:bg-chrome-hover hover:text-chrome-strong",
            collapsed ? "justify-center py-2.5" : "gap-2.5 px-3 py-2"
          )}
        >
          <Globe className="h-4 w-4 shrink-0" />
          {!collapsed && "Lihat Website"}
        </Link>
      </div>
    </aside>
  );
}
