import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BeritaForm } from "@/components/admin/berita-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBeritaPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: berita } = await supabase
    .from("berita")
    .select("id, judul, slug, ringkasan, konten, kategori_id, thumbnail_url, video_url, is_featured, status, penulis_id")
    .eq("id", id)
    .single();

  if (!berita) notFound();

  // Editor biasa cuma boleh edit berita miliknya sendiri
  const bolehEdit = profile?.role === "super_admin" || berita.penulis_id === user.id;
  if (!bolehEdit) redirect("/admin/berita");

  return (
    <BeritaForm
      mode="edit"
      beritaId={berita.id}
      initialData={{
        judul: berita.judul,
        slug: berita.slug,
        ringkasan: berita.ringkasan,
        konten: berita.konten,
        kategori_id: berita.kategori_id,
        thumbnail_url: berita.thumbnail_url,
        video_url: berita.video_url,
        is_featured: berita.is_featured,
        status: berita.status,
      }}
    />
  );
}
