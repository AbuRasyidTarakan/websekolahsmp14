"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FaqFormProps {
  mode: "create" | "edit";
  faqId?: string;
  initialData?: { pertanyaan: string; jawaban: string; urutan: number };
}

export function FaqForm({ mode, faqId, initialData }: FaqFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [pertanyaan, setPertanyaan] = useState(initialData?.pertanyaan ?? "");
  const [jawaban, setJawaban] = useState(initialData?.jawaban ?? "");
  const [urutan, setUrutan] = useState(initialData?.urutan ?? 0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi login berakhir, silakan login ulang.");
      if (!pertanyaan.trim() || !jawaban.trim()) throw new Error("Pertanyaan dan jawaban wajib diisi.");

      if (mode === "create") {
        const { error: insertError } = await supabase
          .from("faq")
          .insert({ pertanyaan: pertanyaan.trim(), jawaban: jawaban.trim(), urutan, penulis_id: user.id });
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from("faq")
          .update({ pertanyaan: pertanyaan.trim(), jawaban: jawaban.trim(), urutan })
          .eq("id", faqId);
        if (updateError) throw updateError;
      }

      router.push("/admin/faq");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan FAQ.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!faqId || !window.confirm("Yakin ingin menghapus FAQ ini?")) return;
    setDeleting(true);
    const { error: deleteError } = await supabase.from("faq").delete().eq("id", faqId);
    setDeleting(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.push("/admin/faq");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">{mode === "create" ? "Tambah FAQ" : "Edit FAQ"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="pertanyaan">Pertanyaan</Label>
          <Input id="pertanyaan" className="mt-1" value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} placeholder="Contoh: Bagaimana cara mendaftar PPDB?" />
        </div>

        <div>
          <Label htmlFor="jawaban">Jawaban</Label>
          <Textarea id="jawaban" className="mt-1" rows={5} value={jawaban} onChange={(e) => setJawaban(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="urutan">Urutan Tampil (angka kecil tampil duluan)</Label>
          <Input id="urutan" type="number" className="mt-1 w-32" value={urutan} onChange={(e) => setUrutan(parseInt(e.target.value) || 0)} />
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
          {mode === "edit" && (
            <Button type="button" variant="destructive" disabled={deleting} onClick={handleDelete} className="ml-auto">
              {deleting ? "Menghapus..." : "Hapus FAQ"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
