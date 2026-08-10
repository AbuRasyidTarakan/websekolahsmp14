"use client";

import { useSidebar } from "@/components/admin/sidebar-context";
import { PanelLeftClose, PanelLeft } from "lucide-react";

export function SidebarToggleButton() {
  const { terbuka, toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      aria-label={terbuka ? "Sembunyikan menu" : "Tampilkan menu"}
      title={terbuka ? "Sembunyikan menu" : "Tampilkan menu"}
      className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent/10"
    >
      {terbuka ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
    </button>
  );
}
