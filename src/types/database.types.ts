// Tipe ini dibuat manual mengikuti schema_portal_berita_sekolah.sql.
// Kalau nanti skema berubah, generate ulang otomatis dengan:
// npx supabase gen types typescript --project-id <project-ref> > src/types/database.types.ts

export type Role = "super_admin" | "editor" | "staf_tu";
export type StatusBerita = "draft" | "published";
export type KategoriAgenda = "Akademik" | "Libur" | "Ujian" | "Ekstrakurikuler" | "Lainnya";

export type TemaPreferensi = "terang" | "kontras" | "sepia" | "gelap_parsial";

export type Profile = {
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

export type Kategori = {
  id: string;
  nama: string;
  slug: string;
  warna: string;
  urutan: number;
  created_at: string;
}

export type Berita = {
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

export type GaleriAlbum = {
  id: string;
  judul_album: string;
  berita_id: string | null;
  cover_url: string | null;
  penulis_id: string;
  created_at: string;
  foto?: GaleriFoto[];
}

export type GaleriFoto = {
  id: string;
  album_id: string;
  url_foto: string;
  caption: string | null;
  urutan: number;
}

export type Agenda = {
  id: string;
  judul_kegiatan: string;
  deskripsi: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  kategori: KategoriAgenda | null;
  penulis_id: string | null;
  created_at: string;
}

export type ProfilSekolah = {
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

export type Dokumen = {
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

export type Faq = {
  id: string;
  pertanyaan: string;
  jawaban: string;
  urutan: number;
  penulis_id: string;
  created_at: string;
  updated_at: string;
}

export type VideoKegiatan = {
  id: string;
  judul: string;
  deskripsi: string | null;
  youtube_url: string;
  penulis_id: string;
  created_at: string;
}

export type GuruStaff = {
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

export type PengumumanBanner = {
  id: string;
  pesan: string;
  is_active: boolean;
  dibuat_oleh: string | null;
  created_at: string;
}

export type AksiLog = "insert" | "update" | "delete";

export type LogAktivitas = {
  id: string;
  aksi: AksiLog;
  entitas: string;
  judul: string | null;
  pelaku_id: string | null;
  created_at: string;
}

export type Kunjungan = {
  id: string;
  visitor_id: string;
  halaman: string;
  tanggal_wita: string;
  created_at: string;
}

// Tipe generik "Database" dipakai oleh @supabase/ssr client (bisa disederhanakan
// dulu seperti ini; bisa diganti hasil generate otomatis Supabase CLI nanti)
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile>; Relationships: [] };
      kategori: { Row: Kategori; Insert: Partial<Kategori>; Update: Partial<Kategori>; Relationships: [] };
      berita: { Row: Berita; Insert: Partial<Berita>; Update: Partial<Berita>; Relationships: [] };
      galeri_album: { Row: GaleriAlbum; Insert: Partial<GaleriAlbum>; Update: Partial<GaleriAlbum>; Relationships: [] };
      galeri_foto: { Row: GaleriFoto; Insert: Partial<GaleriFoto>; Update: Partial<GaleriFoto>; Relationships: [] };
      agenda: { Row: Agenda; Insert: Partial<Agenda>; Update: Partial<Agenda>; Relationships: [] };
      profil_sekolah: { Row: ProfilSekolah; Insert: Partial<ProfilSekolah>; Update: Partial<ProfilSekolah>; Relationships: [] };
      pengumuman_banner: { Row: PengumumanBanner; Insert: Partial<PengumumanBanner>; Update: Partial<PengumumanBanner>; Relationships: [] };
      dokumen: { Row: Dokumen; Insert: Partial<Dokumen>; Update: Partial<Dokumen>; Relationships: [] };
      faq: { Row: Faq; Insert: Partial<Faq>; Update: Partial<Faq>; Relationships: [] };
      video_kegiatan: { Row: VideoKegiatan; Insert: Partial<VideoKegiatan>; Update: Partial<VideoKegiatan>; Relationships: [] };
      guru_staff: { Row: GuruStaff; Insert: Partial<GuruStaff>; Update: Partial<GuruStaff>; Relationships: [] };
      log_aktivitas: { Row: LogAktivitas; Insert: Partial<LogAktivitas>; Update: Partial<LogAktivitas>; Relationships: [] };
      kunjungan: { Row: Kunjungan; Insert: Partial<Kunjungan>; Update: Partial<Kunjungan>; Relationships: [] };
    };
    Views: {};
    Functions: {
      increment_berita_views: { Args: { berita_id: string }; Returns: undefined };
    };
    Enums: {};
    CompositeTypes: {};
  };
}
