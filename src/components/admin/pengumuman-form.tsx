"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function PengumumanForm() {
  const router = useRouter();
  const supabase = createClient();
  const [pesan, setPesan] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pesan.trim()) return;
    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase
      .from("pengumuman_banner")
      .insert({ pesan: pesan.trim(), dibuat_oleh: user?.id });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setPesan("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <Textarea
        value={pesan}
        onChange={(e) => setPesan(e.target.value)}
        placeholder="Contoh: Sekolah libur besok karena cuaca ekstrem, kegiatan belajar dialihkan daring."
        rows={2}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={saving || !pesan.trim()}>
        {saving ? "Menyimpan..." : "Terbitkan Pengumuman"}
      </Button>
    </form>
  );
}
