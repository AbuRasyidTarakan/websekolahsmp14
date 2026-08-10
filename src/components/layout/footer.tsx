import { createClient } from "@/lib/supabase/server";
import { Instagram, Facebook, Play } from "lucide-react";

export async function Footer() {
  const supabase = await createClient();
  const { data: profil } = await supabase.from("profil_sekolah").select("*").eq("id", 1).single();

  const mediaSosial = [
    profil?.instagram_url && {
      label: "Instagram",
      href: profil.instagram_url,
      Icon: Instagram,
      badgeClass: "bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#515bd4]",
    },
    profil?.facebook_url && {
      label: "Facebook",
      href: profil.facebook_url,
      Icon: Facebook,
      badgeClass: "bg-[#1877F2]",
    },
    profil?.youtube_url && {
      label: "YouTube",
      href: profil.youtube_url,
      Icon: Play,
      badgeClass: "bg-[#FF0000]",
    },
  ].filter(Boolean) as { label: string; href: string; Icon: typeof Instagram; badgeClass: string }[];

  return (
    <footer className="mt-16 border-t border-[#0f2544] bg-[#1B3A6B] text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">{profil?.nama_sekolah ?? "SMP Negeri 14 Tarakan"}</p>
          <p className="mt-2 text-sm text-white/70">
            {profil?.deskripsi_singkat ?? "Portal berita dan informasi resmi kegiatan sekolah."}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Menu Cepat</p>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            <li><a href="/berita" className="hover:text-white">Berita</a></li>
            <li><a href="/galeri" className="hover:text-white">Galeri</a></li>
            <li><a href="/agenda" className="hover:text-white">Agenda</a></li>
            <li><a href="/profil-sekolah" className="hover:text-white">Profil Sekolah</a></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Kontak</p>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            {profil?.alamat && <li>{profil.alamat}</li>}
            {profil?.telepon && <li>{profil.telepon}</li>}
            {profil?.email && <li>{profil.email}</li>}
            {!profil?.alamat && !profil?.telepon && !profil?.email && (
              <li className="italic text-white/40">Belum diisi</li>
            )}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Media Sosial</p>
          {mediaSosial.length > 0 ? (
            <ul className="mt-3 flex gap-3">
              {mediaSosial.map(({ label, href, Icon, badgeClass }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${badgeClass} transition-transform hover:scale-110`}
                  >
                    <Icon className={`h-[18px] w-[18px] fill-white text-white ${label === "YouTube" ? "ml-0.5" : ""}`} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm italic text-white/40">Belum diisi</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60" style={{ backgroundColor: "#1a45bc" }}>
        © {new Date().getFullYear()} {profil?.nama_sekolah ?? "SMP Negeri 14 Tarakan"} — Dibuat oleh Tim IT Sekolah
        {" · "}
        <a href="/kebijakan-privasi" className="underline hover:text-white">Kebijakan Privasi</a>
      </div>
    </footer>
  );
}
