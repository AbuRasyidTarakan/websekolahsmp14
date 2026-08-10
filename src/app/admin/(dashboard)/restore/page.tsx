import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RestoreForm } from "@/components/admin/restore-form";

export default async function RestorePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") redirect("/admin");

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Restore Data</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Pulihkan data dari file backup JSON yang pernah diunduh lewat menu Backup Data.
      </p>

      <div className="mt-6">
        <RestoreForm />
      </div>
    </div>
  );
}
