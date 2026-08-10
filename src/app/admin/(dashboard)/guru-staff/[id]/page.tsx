import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GuruStaffForm } from "@/components/admin/guru-staff-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditGuruStaffPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase.from("guru_staff").select("*").eq("id", id).single();
  if (!item) notFound();

  return (
    <GuruStaffForm
      mode="edit"
      itemId={item.id}
      initialData={{
        nama_lengkap: item.nama_lengkap,
        nip: item.nip ?? "",
        jabatan: item.jabatan ?? "",
        mata_pelajaran: item.mata_pelajaran ?? "",
        foto_url: item.foto_url,
        urutan: item.urutan,
        is_active: item.is_active,
      }}
    />
  );
}
