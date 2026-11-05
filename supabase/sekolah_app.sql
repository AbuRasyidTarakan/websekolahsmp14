-- Menu "Sekolah App": daftar link aplikasi sekolah (portal, piket, dst).
-- JALANKAN SEKALI di Supabase Dashboard > SQL Editor.

create table if not exists public.sekolah_app (
  id          uuid primary key default gen_random_uuid(),
  nama        text not null,
  url         text not null,
  deskripsi   text,
  urutan      integer not null default 0,
  is_active   boolean not null default true,
  dibuat_oleh uuid,
  created_at  timestamptz not null default now()
);

alter table public.sekolah_app enable row level security;

-- Siapa saja (termasuk pengunjung yang belum login) boleh MELIHAT aplikasi yang aktif.
drop policy if exists "sekolah_app_lihat_publik" on public.sekolah_app;
create policy "sekolah_app_lihat_publik"
  on public.sekolah_app for select
  using (is_active = true);

-- Super admin (akun aktif) boleh melihat semua (termasuk yang nonaktif),
-- menambah, mengubah, dan menghapus.
drop policy if exists "sekolah_app_super_admin" on public.sekolah_app;
create policy "sekolah_app_super_admin"
  on public.sekolah_app for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'super_admin' and p.is_active
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'super_admin' and p.is_active
    )
  );
