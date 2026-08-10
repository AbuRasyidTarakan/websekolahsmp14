import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function KelolaFaqPage() {
  const supabase = await createClient();
  const { data: faqList } = await supabase.from("faq").select("*").order("urutan", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Kelola FAQ</h1>
        <Link href="/admin/faq/baru">
          <Button>+ Tambah FAQ</Button>
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        {faqList?.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-10 text-center text-foreground/50">
            Belum ada FAQ.
          </p>
        )}
        {faqList?.map((f) => (
          <Link
            key={f.id}
            href={`/admin/faq/${f.id}`}
            className="block rounded-lg border border-border bg-white p-4 hover:border-primary"
          >
            <p className="font-medium">{f.pertanyaan}</p>
            <p className="mt-1 line-clamp-1 text-sm text-foreground/60">{f.jawaban}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
