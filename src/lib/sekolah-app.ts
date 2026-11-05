import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { urlAman } from "@/lib/sekolah-app-url";
import type { SekolahApp } from "@/types/database.types";

/**
 * Daftar aplikasi sekolah yang AKTIF untuk ditampilkan di halaman publik
 * (menu atas, footer, dan halaman /sekolah-app).
 *
 * Dibungkus cache() React supaya Navbar + Footer + halaman dalam satu request
 * cukup memanggil database sekali. Kalau tabel belum dibuat / query gagal,
 * hasilnya daftar kosong (halaman publik tetap jalan, tidak error).
 */
export const getSekolahApps = cache(async (): Promise<SekolahApp[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sekolah_app")
    .select("*")
    .eq("is_active", true)
    .order("urutan", { ascending: true })
    .order("nama", { ascending: true });

  if (error || !data) return [];
  return (data as SekolahApp[]).filter((a) => urlAman(a.url) !== null);
});
