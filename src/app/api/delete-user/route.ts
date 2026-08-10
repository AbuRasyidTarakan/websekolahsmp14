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

  // Hapus dari auth.users — baris di `profiles` ikut terhapus otomatis
  // (foreign key profiles.id -> auth.users.id pakai ON DELETE CASCADE)
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
