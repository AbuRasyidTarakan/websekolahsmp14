import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") {
    return NextResponse.json({ error: "Hanya super admin yang bisa mengubah data pengguna." }, { status: 403 });
  }

  const { targetUserId, email, nama_lengkap, jabatan, foto_profil, role, password } = await request.json();

  if (!targetUserId || !email || !nama_lengkap) {
    return NextResponse.json({ error: "Email dan nama lengkap wajib diisi." }, { status: 400 });
  }
  if (password && password.length < 6) {
    return NextResponse.json({ error: "Password baru minimal 6 karakter." }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  // Update email (dan password KALAU diisi) lewat admin API — ini satu-satunya
  // cara resmi mengubah data di auth.users, tidak bisa lewat tabel biasa.
  const authUpdatePayload: { email: string; password?: string; user_metadata: { nama_lengkap: string } } = {
    email,
    user_metadata: { nama_lengkap },
  };
  if (password) authUpdatePayload.password = password;

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, authUpdatePayload);
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Sinkronkan juga ke tabel profiles
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({ email, nama_lengkap, jabatan: jabatan || null, foto_profil, role })
    .eq("id", targetUserId);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  await supabaseAdmin.from("log_aktivitas").insert({
    aksi: "update",
    entitas: "pengguna",
    judul: `${nama_lengkap} (${email})`,
    pelaku_id: user.id,
  });

  return NextResponse.json({ success: true });
}
