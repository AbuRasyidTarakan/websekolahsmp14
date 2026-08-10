"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PILIHAN = [10, 20, 30, 40, 50, 100];

export function PerPageSelect({ current }: { current: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("per", e.target.value);
    params.set("page", "1"); // reset ke halaman 1 tiap ganti jumlah baris
    router.push(`?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-foreground/60">
      Tampilkan
      <select
        value={current}
        onChange={handleChange}
        className="rounded-md border border-border bg-background px-2 py-1 text-sm"
      >
        {PILIHAN.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      per halaman
    </label>
  );
}
