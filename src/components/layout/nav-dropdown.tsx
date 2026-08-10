"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
}

export function NavDropdown({ items }: { items: MenuItem[] }) {
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
        Lainnya
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${terbuka ? "rotate-180" : ""}`} />
      </button>

      {terbuka && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-background py-1 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setTerbuka(false)}
              className="block px-4 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
