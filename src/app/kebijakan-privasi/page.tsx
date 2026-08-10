import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function KebijakanPrivasiPage() {
  const supabase = await createClient();
  const { data: profil } = await supabase.from("profil_sekolah").select("nama_sekolah, alamat, telepon, email").eq("id", 1).single();

  const namaSekolah = profil?.nama_sekolah ?? "SMP Negeri 14 Tarakan";

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Kebijakan Privasi</h1>
        <p className="mt-2 text-sm text-foreground/50">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-sm mt-8 max-w-none prose-headings:font-display">
          <p>
            Website ini dikelola oleh {namaSekolah} sebagai portal berita dan informasi resmi kegiatan sekolah.
            Kami berkomitmen menjaga privasi seluruh pengunjung, siswa, orang tua/wali, dan masyarakat yang
            mengakses website ini.
          </p>

          <h2>1. Data yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan data secara terbatas, yaitu:</p>
          <ul>
            <li>
              <strong>Statistik kunjungan anonim</strong> — sebuah kode acak tersimpan di perangkat Anda
              (localStorage browser) untuk menghitung jumlah pengunjung harian dan halaman yang paling sering
              dibuka. Kode ini <strong>tidak berisi nama, email, alamat IP, atau data pribadi apapun</strong>,
              dan tidak dapat digunakan untuk mengidentifikasi Anda secara personal.
            </li>
            <li>
              <strong>Data akun</strong> — khusus untuk guru/staf yang mengelola konten website (login admin),
              kami menyimpan nama, email, dan jabatan untuk keperluan pengelolaan konten.
            </li>
          </ul>
          <p>
            Website ini <strong>tidak menggunakan cookie pelacakan pihak ketiga</strong> (seperti Google
            Analytics atau iklan) dan <strong>tidak menjual atau membagikan data apapun</strong> ke pihak luar.
          </p>

          <h2>2. Foto dan Dokumentasi Kegiatan</h2>
          <p>
            Dalam pemberitaan kegiatan sekolah, kami dapat menampilkan foto siswa yang diambil selama kegiatan
            resmi sekolah (upacara, lomba, pembelajaran, dan acara sekolah lainnya). Foto-foto ini digunakan
            semata-mata untuk keperluan dokumentasi dan publikasi informasi kegiatan sekolah.
          </p>
          <p>
            Kami tidak menampilkan data pribadi sensitif siswa (seperti NISN, nilai, atau alamat rumah) di
            halaman publik manapun.
          </p>

          <h2>3. Hak Orang Tua/Wali</h2>
          <p>
            Orang tua/wali yang berkeberatan foto anaknya ditampilkan di website ini dapat mengajukan
            permohonan penghapusan foto kapan saja melalui kontak di bawah. Permohonan akan kami proses dalam
            waktu wajar.
          </p>

          <h2>4. Keamanan Data</h2>
          <p>
            Data akun guru/staf disimpan menggunakan layanan database dengan enkripsi standar industri.
            Akses ke data pengelolaan website dibatasi hanya untuk guru/staf yang berwenang.
          </p>

          <h2>5. Perubahan Kebijakan</h2>
          <p>
            Kebijakan ini dapat diperbarui sewaktu-waktu mengikuti perkembangan pengelolaan website. Perubahan
            akan tercermin pada tanggal "Terakhir diperbarui" di atas.
          </p>

          <h2>6. Kontak</h2>
          <p>Pertanyaan atau permohonan terkait privasi dapat disampaikan melalui:</p>
          <ul>
            {profil?.alamat && <li>{profil.alamat}</li>}
            {profil?.telepon && <li>Telepon: {profil.telepon}</li>}
            {profil?.email && <li>Email: {profil.email}</li>}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
