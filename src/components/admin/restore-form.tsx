"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const KATA_KONFIRMASI = "PULIHKAN";

interface HasilTabel {
  tabel: string;
  total: number;
  berhasil: number;
  gagal: number;
  contohError: string[];
}

export function RestoreForm() {
  const [fileData, setFileData] = useState<Record<string, unknown> | null>(null);
  const [namaFile, setNamaFile] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [proses, setProses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasil, setHasil] = useState<HasilTabel[] | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setHasil(null);
    setNamaFile(file.name);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!json.tabel) throw new Error("File ini bukan file backup yang valid (tidak ada bagian 'tabel').");
      setFileData(json);
    } catch {
      setError("Gagal membaca file. Pastikan ini file backup JSON yang benar dari fitur Backup Data.");
      setFileData(null);
    }
  }

  async function handleRestore() {
    if (!fileData) return;
    setProses(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/restore-backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal melakukan restore.");
      setHasil(json.hasil);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal melakukan restore.");
    } finally {
      setProses(false);
    }
  }

  const ringkasanTabel = fileData
    ? Object.entries(fileData.tabel as Record<string, unknown[]>)
        .filter(([, rows]) => Array.isArray(rows) && rows.length > 0)
        .map(([nama, rows]) => ({ nama, jumlah: (rows as unknown[]).length }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="file-backup">Pilih File Backup (.json)</Label>
        <input
          id="file-backup"
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
        />
      </div>

      {error && (
        <p className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      {fileData && !hasil && (
        <div className="rounded-lg border border-border bg-white p-5">
          <p className="text-sm font-semibold">Isi File: {namaFile}</p>
          <p className="mt-1 text-xs text-foreground/50">{String(fileData.dibuat_pada ?? "")}</p>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {ringkasanTabel.map((t) => (
              <div key={t.nama} className="rounded-md bg-accent/5 px-3 py-2">
                <p className="font-medium">{t.nama}</p>
                <p className="text-xs text-foreground/50">{t.jumlah} baris</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-red-700">
              <AlertTriangle className="h-4 w-4" /> Perhatian
            </p>
            <p className="mt-1 text-sm text-red-700">
              Ini akan menimpa data yang ID-nya sama persis dengan yang sudah ada di database saat ini.
              Data yang tidak ada di file backup TIDAK akan dihapus. Tindakan ini tidak sepenuhnya bisa dibatalkan.
            </p>

            <div className="mt-3">
              <Label htmlFor="konfirmasi-restore" className="text-red-700">
                Ketik <strong>{KATA_KONFIRMASI}</strong> untuk melanjutkan
              </Label>
              <Input
                id="konfirmasi-restore"
                className="mt-1"
                value={konfirmasi}
                onChange={(e) => setKonfirmasi(e.target.value)}
              />
            </div>

            <Button
              onClick={handleRestore}
              disabled={konfirmasi !== KATA_KONFIRMASI || proses}
              variant="destructive"
              className="mt-3"
            >
              {proses ? "Memulihkan data..." : "Mulai Restore"}
            </Button>
          </div>
        </div>
      )}

      {hasil && (
        <div className="rounded-lg border border-border bg-white p-5">
          <p className="flex items-center gap-2 font-display font-bold text-green-700">
            <CheckCircle2 className="h-5 w-5" /> Restore Selesai
          </p>
          <div className="mt-4 space-y-2">
            {hasil.map((h) => (
              <div key={h.tabel} className="rounded-md border border-border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{h.tabel}</span>
                  <span>
                    <span className="text-green-700">{h.berhasil} berhasil</span>
                    {h.gagal > 0 && <span className="ml-2 text-red-600">{h.gagal} gagal</span>}
                    <span className="ml-2 text-foreground/40">/ {h.total} total</span>
                  </span>
                </div>
                {h.contohError.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-xs text-red-500">
                    {h.contohError.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
