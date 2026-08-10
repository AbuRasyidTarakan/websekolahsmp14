import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. Pastikan yang memanggil API ini benar-benar super_admin yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "super_admin") {
    return NextResponse.json({ error: "Hanya super admin yang bisa menambah pengguna." }, { status: 403 });
  }

  // 2. Ambil data dari form
  const { email, password, nama_lengkap, jabatan, role } = await request.json();

  if (!email || !password || !nama_lengkap) {
    return NextResponse.json({ error: "Email, password, dan nama lengkap wajib diisi." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });
  }

  // 3. Buat user pakai admin client (bypass RLS, akses penuh)
  const supabaseAdmin = createAdminClient();

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // langsung aktif, tidak perlu klik link verifikasi email
    user_metadata: { nama_lengkap },
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // 4. Pastikan baris di `profiles` benar-benar ada — pakai upsert (bukan update),
  //    supaya TIDAK bergantung sepenuhnya pada trigger on_auth_user_created
  //    (yang bisa gagal diam-diam karena sudah pakai exception handling).
  const { error: upsertError } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        id: newUser.user.id,
        email,
        nama_lengkap,
        jabatan: jabatan || null,
        role: role || "editor",
        is_active: true,
      },
      { onConflict: "id" }
    );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 400 });
  }

  // Catat log aktivitas manual (trigger DB tidak bisa nangkap aksi lewat service_role key)
  await supabaseAdmin.from("log_aktivitas").insert({
    aksi: "insert",
    entitas: "pengguna",
    judul: `${nama_lengkap} (${email})`,
    pelaku_id: user.id,
  });

  return NextResponse.json({ success: true });
}
