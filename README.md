# Portal Berita Sekolah — SMP Negeri 14 Tarakan

Struktur awal project Next.js (App Router) + Supabase untuk portal berita sekolah multi-editor.

## Struktur Folder

```
src/
├── app/
│   ├── page.tsx                  → Beranda (publik)
│   ├── layout.tsx                → Root layout
│   ├── globals.css               → Tema warna (CSS variables)
│   ├── berita/[slug]/            → Detail berita (belum dibuat, tahap berikutnya)
│   ├── galeri/[id]/              → Detail album galeri (belum dibuat)
│   ├── agenda/                   → Kalender akademik (belum dibuat)
│   ├── profil-sekolah/           → Profil sekolah (belum dibuat)
│   └── admin/
│       ├── layout.tsx            → Layout admin (proteksi login + sidebar)
│       ├── login/page.tsx        → Halaman login guru
│       ├── page.tsx              → Dashboard admin
│       ├── berita/baru/          → Form tulis berita (belum dibuat)
│       ├── galeri/               → Kelola galeri (belum dibuat)
│       └── agenda/               → Kelola agenda (belum dibuat)
├── components/
│   ├── ui/                       → Komponen shadcn/ui (diisi via `npx shadcn add ...`)
│   ├── layout/                   → Navbar, Footer, dsb (custom, bukan shadcn)
│   └── berita/                   → HeroSlider, BeritaCard, dsb (custom)
├── lib/supabase/
│   ├── client.ts                 → Supabase client untuk Client Component
│   └── server.ts                 → Supabase client untuk Server Component
├── types/database.types.ts       → Tipe TypeScript sesuai schema_portal_berita_sekolah.sql
└── middleware.ts                 → Proteksi rute /admin/*
```

## Langkah Setup dari Nol

1. **Buat project Supabase baru** (khusus website ini, terpisah dari PPDB/BK) memakai
   akun Gmail "sistem" yang sudah didiskusikan — bukan akun pribadi.

2. **Jalankan `schema_portal_berita_sekolah.sql`** di Supabase SQL Editor project baru
   tersebut (file terpisah yang sudah dibuat sebelumnya).

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Setup environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari
   Dashboard Supabase > Project Settings > API.

5. **Update `next.config.js`** — ganti `xxxx.supabase.co` dengan project ref Supabase
   yang sebenarnya (supaya `<Image>` dari Next.js bisa load gambar dari Storage).

6. **Buat user admin pertama:**
   - Supabase Dashboard > Authentication > Add User (isi email + password)
   - Di SQL Editor, jalankan:
     ```sql
     update profiles set role = 'super_admin' where id = '<uuid-user-tadi>';
     ```

7. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` (publik) dan `http://localhost:3000/admin/login` (admin).

## Setup shadcn/ui (Tahap Berikutnya)

Dipakai untuk komponen panel admin (form, tabel, dialog) — bukan halaman publik,
sesuai kesepakatan desain sebelumnya:

```bash
npx shadcn@latest init
npx shadcn@latest add button input table dialog form dropdown-menu toast
```

## Deploy ke Netlify

1. Push project ini ke **GitHub (repo privat)**.
2. Di Netlify: **Add new site > Import from Git** > pilih repo tadi.
3. Install plugin Next.js runtime (biasanya otomatis terdeteksi dari `netlify.toml`).
4. Set environment variables yang sama seperti `.env.local` di
   **Site Settings > Environment Variables**.
5. Deploy. Setelah berhasil, tambahkan custom domain `.sch.id` (kalau sudah tersedia)
   di **Domain Management**.

## Belum Dikerjakan (Tahap Selanjutnya)

- [ ] Desain visual Beranda + Hero Slider (token warna/tipografi sesuai identitas sekolah)
- [ ] Setup shadcn/ui + form tulis berita (rich text editor Tiptap)
- [ ] Upload gambar ke Supabase Storage dengan kompresi client-side (resize + WebP)
- [ ] Halaman detail berita, galeri, agenda, profil sekolah
- [ ] Full-text search di halaman pencarian
