"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function DeleteAgendaButton({ id, judul }: { id: string; judul: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Hapus agenda "${judul}"?`)) return;
    setDeleting(true);
    await supabase.from("agenda").delete().eq("id", id);
    setDeleting(false);
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={deleting} className="text-red-600">
      {deleting ? "Menghapus..." : "Hapus"}
    </Button>
  );
}
