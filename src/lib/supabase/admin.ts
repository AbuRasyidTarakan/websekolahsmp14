// PERINGATAN: file ini pakai SERVICE_ROLE_KEY yang punya akses PENUH ke database,
// tembus semua RLS. HANYA boleh diimport dari kode server (API route), TIDAK PERNAH
// dari Client Component ("use client") — kalau salah pakai, kunci ini bisa bocor ke browser.

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // TANPA prefix NEXT_PUBLIC_ — wajib tetap rahasia
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
