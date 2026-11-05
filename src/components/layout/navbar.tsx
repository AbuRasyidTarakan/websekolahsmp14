import Link from "next/link";
import { EmergencyBanner } from "@/components/layout/emergency-banner";
import { SearchToggle } from "@/components/layout/search-toggle";
import { VisitorTracker } from "@/components/layout/visitor-tracker";
import { NavDropdown } from "@/components/layout/nav-dropdown";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SekolahAppDropdown } from "@/components/layout/sekolah-app-dropdown";
import { getSekolahApps } from "@/lib/sekolah-app";
import { domainDari, urlAman } from "@/lib/sekolah-app-url";

const menuInti = [
  { label: "Beranda", href: "/" },
  { label: "Berita", href: "/berita" },
  { label: "Galeri", href: "/galeri" },
  { label: "Agenda", href: "/agenda" },
];

const menuLainnya = [
  { label: "Video", href: "/video" },
  { label: "Unduhan", href: "/unduhan" },
  { label: "Guru & Staff", href: "/guru-staff" },
  { label: "FAQ", href: "/faq" },
  { label: "Profil Sekolah", href: "/profil-sekolah" },
];

export async function Navbar() {
  const apps = await getSekolahApps();
  const itemApp = apps.map((a) => ({
    id: a.id,
    nama: a.nama,
    href: urlAman(a.url) ?? "#",
    domain: domainDari(a.url),
  }));

  return (
    <div className="sticky top-0 z-40">
      <VisitorTracker />
      <EmergencyBanner />
      <header className="border-b border-[#0f2544] bg-[#1B3A6B]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
              14
            </div>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold text-white">SMP Negeri 14</p>
              <p className="text-xs text-white/60">Tarakan</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {menuInti.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white"
              >
                {m.label}
              </Link>
            ))}
            {itemApp.length > 0 ? (
              <SekolahAppDropdown items={itemApp} />
            ) : (
              <Link
                href="/sekolah-app"
                className="rounded-md px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white"
              >
                Sekolah App
              </Link>
            )}
            <NavDropdown items={menuLainnya} />
          </nav>

          <div className="flex items-center gap-1">
            <SearchToggle />
            <MobileMenu items={[...menuInti, { label: "Sekolah App", href: "/sekolah-app" }, ...menuLainnya]} />
          </div>
        </div>
      </header>
    </div>
  );
}
