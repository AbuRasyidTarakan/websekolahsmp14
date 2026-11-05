"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";

interface AppItem {
  id: string;
  nama: string;
  href: string;
  domain: string;
}

// Menu "Sekolah App" di top menu: dropdown berisi link aplikasi sekolah (buka di tab baru)
export function SekolahAppDropdown({ items }: { items: AppItem[] }) {
  const [terbuka, setTerbuka] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickLuar(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setTerbuka(false);
    }
    document.addEventListener("mousedown", handleClickLuar);
    return () => document.removeEventListener("mousedown", handleClickLuar);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setTerbuka((t) => !t)}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white"
      >
        Sekolah App
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${terbuka ? "rotate-180" : ""}`} />
      </button>

      {terbuka && (
        <div className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-border bg-background py-1 shadow-lg">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setTerbuka(false)}
              className="flex items-center justify-between gap-3 px-4 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{item.nama}</span>
                <span className="block truncate text-xs text-foreground/40">{item.domain}</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-foreground/30" />
            </a>
          ))}
          <div className="my-1 border-t border-border" />
          <Link
            href="/sekolah-app"
            onClick={() => setTerbuka(false)}
            className="block px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
          >
            Lihat semua →
          </Link>
        </div>
      )}
    </div>
  );
}
