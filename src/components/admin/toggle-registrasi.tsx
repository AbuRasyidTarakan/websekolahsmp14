"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";
import { UserPlus } from "lucide-react";

export function ToggleRegistrasi({ terbukaAwal }: { terbukaAwal: boolean }) {
  const router = useRouter();
  const supabase = createClient();
  const [terbuka, setTerbuka] = useState(terbukaAwal);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    const nilaiBaru = !terbuka;
    const { error } = await supabase
      .from("profil_sekolah")
      .update({ pendaftaran_editor_terbuka: nilaiBaru })
      .eq("id", 1);

    setSaving(false);
    if (!error) {
      setTerbuka(nilaiBaru);
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-white p-4">
      <div className="flex items-center gap-3">
        <UserPlus className="h-5 w-5 text-foreground/50" />
        <div>
          <p className="text-sm font-semibold">Pendaftaran Editor Mandiri</p>
          <p className="text-xs text-foreground/50">
            {terbuka ? "Terbuka — siapa saja bisa daftar di /register" : "Tertutup — halaman /register tidak bisa diakses"}
          </p>
        </div>
      </div>
      <Switch checked={terbuka} onChange={toggle} disabled={saving} />
    </div>
  );
}
