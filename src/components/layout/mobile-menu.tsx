"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
}

export function MobileMenu({ items }: { items: MenuItem[] }) {
  const [terbuka, setTerbuka] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setTerbuka(true)}
        aria-label="Buka menu"
        className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
      >
        <Menu className="h-5 w-5" />
      </button>

      {terbuka && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setTerbuka(false)}>
          <div
            className="absolute right-0 top-0 h-full w-64 bg-background p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold">Menu</span>
              <button onClick={() => setTerbuka(false)} aria-label="Tutup menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 space-y-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setTerbuka(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-primary/5 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
