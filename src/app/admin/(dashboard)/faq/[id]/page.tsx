import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FaqForm } from "@/components/admin/faq-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: faq } = await supabase.from("faq").select("*").eq("id", id).single();
  if (!faq) notFound();

  return (
    <FaqForm
      mode="edit"
      faqId={faq.id}
      initialData={{ pertanyaan: faq.pertanyaan, jawaban: faq.jawaban, urutan: faq.urutan }}
    />
  );
}
