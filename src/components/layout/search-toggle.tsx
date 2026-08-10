"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchToggle() {
  const router = useRouter();
  const [terbuka, setTerbuka] = useState(false);
  const [q, setQ] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/berita?q=${encodeURIComponent(q.trim())}`);
    setTerbuka(false);
    setQ("");
  }

  if (terbuka) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
        <input
          autoFocus
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari berita..."
          className="h-9 w-40 rounded-full border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-56"
        />
        <button
          type="button"
          aria-label="Tutup pencarian"
          onClick={() => setTerbuka(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </form>
    );
  }

  return (
    <button
      aria-label="Cari berita"
      onClick={() => setTerbuka(true)}
      className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
    >
      <Search className="h-4 w-4" />
    </button>
  );
}
