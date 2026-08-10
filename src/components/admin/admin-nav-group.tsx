"use client";

import { ChevronDown } from "lucide-react";
import { useSidebar } from "@/components/admin/sidebar-context";

interface AdminNavGroupProps {
  label: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function AdminNavGroup({ label, icon, defaultOpen = false, children }: AdminNavGroupProps) {
  const { openGroups, toggleGroup } = useSidebar();
  const terbuka = openGroups[label] ?? defaultOpen;

  return (
    <div>
      <button
        onClick={() => toggleGroup(label, defaultOpen)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-accent/10"
      >
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${terbuka ? "rotate-180" : ""}`} />
      </button>
      {terbuka && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  );
}
