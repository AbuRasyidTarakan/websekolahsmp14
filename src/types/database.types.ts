// Tipe ini dibuat manual mengikuti schema_portal_berita_sekolah.sql.
// Kalau nanti skema berubah, generate ulang otomatis dengan:
// npx supabase gen types typescript --project-id <project-ref> > src/types/database.types.ts

export type Role = "super_admin" | "editor" | "staf_tu";
export type StatusBerita = "draft" | "published";
export type KategoriAgenda = "Akademik" | "Libur" | "Ujian" | "Ekstrakurikuler" | "Lainnya";

export type TemaPreferensi = "terang" | "kontras" | "sepia" | "gelap_parsial";

export interface Profile {
  id: string;
  email: string | null;
  nama_lengkap: string;
  jabatan: string | null;
  foto_profil: string | null;
  role: Role;
  is_active: boolean;
  tema_preferensi: TemaPreferensi;
  created_at: string;
  updated_at: string;
}

export interface Kategori {
  id: string;
  nama: string;
  slug: string;
  warna: string;
  urutan: number;
  created_at: string;
}

export interface Berita {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  konten: string;
  thumbnail_url: string | null;
  video_url: string | null;
  kategori_id: string | null;
  penulis_id: string;
  status: StatusBerita;
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // Relasi (hasil join, opsional tergantung query)
  kategori?: Kategori;
  penulis?: Profile;
}

export interface GaleriAlbum {
  id: string;
  judul_album: string;
  berita_id: string | null;
  cover_url: string | null;
  penulis_id: string;
  created_at: string;
  foto?: GaleriFoto[];
}

export interface GaleriFoto {
  id: string;
  album_id: string;
  url_foto: string;
  caption: string | null;
  urutan: number;
}

export interface Agenda {
  id: string;
  judul_kegiatan: string;
  deskripsi: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  kategori: KategoriAgenda | null;
  penulis_id: string | null;
  created_at: string;
}

export interface ProfilSekolah {
  id: 1;
  nama_sekolah: string | null;
  npsn: string | null;
  deskripsi_singkat: string | null;
  visi: string | null;
  misi: string[];
  sejarah: string | null;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  pendaftaran_editor_terbuka: boolean;
  struktur_organisasi: { nama: string; jabatan: string; foto_url?: string }[];
  logo_url: string | null;
  updated_at: string;
}

export type KategoriDokumen = "Kalender Akademik" | "Formulir" | "Tata Tertib" | "Surat Edaran" | "Lainnya";

export interface Dokumen {
  id: string;
  judul: string;
  deskripsi: string | null;
  kategori: KategoriDokumen;
  file_url: string;
  file_name: string;
  file_size: number | null;
  penulis_id: string;
  created_at: string;
}

export interface Faq {
  id: string;
  pertanyaan: string;
  jawaban: string;
  urutan: number;
  penulis_id: string;
  created_at: string;
  updated_at: string;
}

export interface VideoKegiatan {
  id: string;
  judul: string;
  deskripsi: string | null;
  youtube_url: string;
  penulis_id: string;
  created_at: string;
}

export interface GuruStaff {
  id: string;
  nama_lengkap: string;
  nip: string | null;
  jabatan: string | null;
  mata_pelajaran: string | null;
  foto_url: string | null;
  urutan: number;
  is_active: boolean;
  penulis_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PengumumanBanner {
  id: string;
  pesan: string;
  is_active: boolean;
  dibuat_oleh: string | null;
  created_at: string;
}

// Tipe generik "Database" dipakai oleh @supabase/ssr client (bisa disederhanakan
// dulu seperti ini; bisa diganti hasil generate otomatis Supabase CLI nanti)
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      kategori: { Row: Kategori; Insert: Partial<Kategori>; Update: Partial<Kategori> };
      berita: { Row: Berita; Insert: Partial<Berita>; Update: Partial<Berita> };
      galeri_album: { Row: GaleriAlbum; Insert: Partial<GaleriAlbum>; Update: Partial<GaleriAlbum> };
      galeri_foto: { Row: GaleriFoto; Insert: Partial<GaleriFoto>; Update: Partial<GaleriFoto> };
      agenda: { Row: Agenda; Insert: Partial<Agenda>; Update: Partial<Agenda> };
      profil_sekolah: { Row: ProfilSekolah; Insert: Partial<ProfilSekolah>; Update: Partial<ProfilSekolah> };
      pengumuman_banner: { Row: PengumumanBanner; Insert: Partial<PengumumanBanner>; Update: Partial<PengumumanBanner> };
    };
  };
}
