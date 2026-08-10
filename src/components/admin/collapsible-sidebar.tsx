"use client";

import { useSidebar } from "@/components/admin/sidebar-context";
import { cn } from "@/lib/utils";

export function CollapsibleSidebar({ children }: { children: React.ReactNode }) {
  const { terbuka } = useSidebar();

  return (
    <aside
      className={cn(
        "shrink-0 overflow-hidden border-r border-border transition-all duration-200 ease-in-out",
        terbuka ? "w-64 p-4" : "w-0 border-r-0 p-0"
      )}
    >
      <div className="w-56">{children}</div>
    </aside>
  );
}
