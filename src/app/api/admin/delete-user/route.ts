import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractStoragePath } from "@/lib/storage-helpers";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") {
    return NextResponse.json({ error: "Hanya super admin yang bisa menghapus pengguna." }, { status: 403 });
  }

  const { targetUserId } = await request.json();
  if (!targetUserId) {
    return NextResponse.json({ error: "ID pengguna tidak ada." }, { status: 400 });
  }
  if (targetUserId === user.id) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri." }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  // Ambil dulu nama, email, & foto profilnya SEBELUM dihapus
  const { data: targetProfile } = await supabaseAdmin
    .from("profiles")
    .select("nama_lengkap, email, foto_profil")
    .eq("id", targetUserId)
    .single();

  const fotoPath = extractStoragePath(targetProfile?.foto_profil, "gambar-website");
  if (fotoPath) {
    await supabaseAdmin.storage.from("gambar-website").remove([fotoPath]);
  }

  // Hapus dari auth.users — baris di `profiles` ikut terhapus otomatis
  // (foreign key profiles.id -> auth.users.id pakai ON DELETE CASCADE)
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  await supabaseAdmin.from("log_aktivitas").insert({
    aksi: "delete",
    entitas: "pengguna",
    judul: targetProfile ? `${targetProfile.nama_lengkap} (${targetProfile.email})` : "Pengguna",
    pelaku_id: user.id,
  });

  return NextResponse.json({ success: true });
}
