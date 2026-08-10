import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <p className="font-display text-6xl font-bold text-primary/20">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Halaman Tidak Ditemukan</h1>
        <p className="mt-2 text-foreground/60">
          Berita yang dicari mungkin sudah dihapus atau alamatnya salah.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Kembali ke Beranda
        </Link>
      </main>
      <Footer />
    </>
  );
}
