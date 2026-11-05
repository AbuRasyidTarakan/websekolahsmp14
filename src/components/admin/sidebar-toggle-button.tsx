"use client";

import { useSidebar } from "@/components/admin/sidebar-context";
import { AlignJustify } from "lucide-react";

export function SidebarToggleButton() {
  const { terbuka, toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      aria-label={terbuka ? "Sembunyikan menu" : "Tampilkan menu"}
      title={terbuka ? "Sembunyikan menu" : "Tampilkan menu"}
      className="shrink-0 rounded-lg p-2 text-chrome-muted transition-colors hover:bg-chrome-hover hover:text-chrome-strong"
    >
      <AlignJustify className="h-5 w-5" />
    </button>
  );
}
