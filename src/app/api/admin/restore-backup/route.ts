import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Urutan restore PENTING — tabel "induk" (direferensikan tabel lain via foreign key)
// harus dipulihkan lebih dulu, supaya tabel "anak" tidak gagal karena referensinya belum ada.
const URUTAN_TABEL = [
  "profiles",
  "kategori",
  "profil_sekolah",
  "guru_staff",
  "faq",
  "agenda",
  "dokumen",
  "pengumuman_banner",
  "video_kegiatan",
  "galeri_album",
  "berita",
  "galeri_foto",
  "log_aktivitas",
];

interface HasilTabel {
  tabel: string;
  total: number;
  berhasil: number;
  gagal: number;
  contohError: string[];
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") {
    return NextResponse.json({ error: "Hanya super admin yang bisa melakukan restore." }, { status: 403 });
  }

  const body = await request.json();
  const dataTabel = body?.tabel;

  if (!dataTabel || typeof dataTabel !== "object") {
    return NextResponse.json({ error: "Format file backup tidak valid." }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();
  const hasilSemua: HasilTabel[] = [];

  for (const namaTabel of URUTAN_TABEL) {
    const baris = dataTabel[namaTabel];
    if (!Array.isArray(baris) || baris.length === 0) continue;

    const hasil: HasilTabel = { tabel: namaTabel, total: baris.length, berhasil: 0, gagal: 0, contohError: [] };

    // Upsert SATU-SATU (bukan batch), supaya 1 baris gagal tidak menggagalkan semuanya
    for (const row of baris) {
      const { error } = await supabaseAdmin.from(namaTabel).upsert(row, { onConflict: "id" });
      if (error) {
        hasil.gagal++;
        if (hasil.contohError.length < 3) hasil.contohError.push(error.message);
      } else {
        hasil.berhasil++;
      }
    }

    hasilSemua.push(hasil);
  }

  // Catat aksi restore ini sendiri ke log aktivitas
  await supabaseAdmin.from("log_aktivitas").insert({
    aksi: "insert",
    entitas: "pengguna",
    judul: `Restore backup dilakukan oleh ${user.email}`,
    pelaku_id: user.id,
  });

  return NextResponse.json({ success: true, hasil: hasilSemua });
}
