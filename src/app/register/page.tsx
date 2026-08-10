import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RegistrasiEditorForm } from "@/components/pendaftaran/registrasi-editor-form";
import { Lock } from "lucide-react";

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: profil } = await supabase
    .from("profil_sekolah")
    .select("pendaftaran_editor_terbuka")
    .eq("id", 1)
    .single();

  const terbuka = profil?.pendaftaran_editor_terbuka ?? false;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-10">
        {terbuka ? (
          <RegistrasiEditorForm />
        ) : (
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-foreground/30" />
            <h1 className="mt-3 font-display text-xl font-bold">Pendaftaran Sedang Ditutup</h1>
            <p className="mt-2 text-sm text-foreground/60">
              Pendaftaran editor berita untuk saat ini belum dibuka. Silakan hubungi admin sekolah untuk info
              lebih lanjut.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
