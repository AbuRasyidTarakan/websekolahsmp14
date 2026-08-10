import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FaqAccordion } from "@/components/berita/faq-accordion";

export default async function FaqPage() {
  const supabase = await createClient();
  const { data: faqList } = await supabase.from("faq").select("*").order("urutan", { ascending: true });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Pertanyaan Umum</h1>
        <p className="mt-2 text-foreground/60">Jawaban untuk pertanyaan yang paling sering ditanyakan.</p>

        <div className="mt-6">
          {faqList?.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-10 text-center text-foreground/50">
              Belum ada FAQ.
            </p>
          ) : (
            <FaqAccordion items={faqList ?? []} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
