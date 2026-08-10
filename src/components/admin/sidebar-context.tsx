"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextValue {
  terbuka: boolean;
  toggle: () => void;
  openGroups: Record<string, boolean>;
  toggleGroup: (label: string, defaultOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const KUNCI_SIDEBAR = "admin_sidebar_terbuka";
const KUNCI_GRUP = "admin_sidebar_grup_terbuka";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [terbuka, setTerbuka] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const tersimpan = localStorage.getItem(KUNCI_SIDEBAR);
    if (tersimpan !== null) setTerbuka(tersimpan === "true");

    const grupTersimpan = localStorage.getItem(KUNCI_GRUP);
    if (grupTersimpan !== null) {
      try {
        setOpenGroups(JSON.parse(grupTersimpan));
      } catch {
        // biarkan default kosong kalau data korup
      }
    }
  }, []);

  function toggle() {
    setTerbuka((t) => {
      const nilaiBaru = !t;
      localStorage.setItem(KUNCI_SIDEBAR, String(nilaiBaru));
      return nilaiBaru;
    });
  }

  function toggleGroup(label: string, defaultOpen: boolean) {
    setOpenGroups((prev) => {
      const statusSaatIni = prev[label] ?? defaultOpen;
      const baru = { ...prev, [label]: !statusSaatIni };
      localStorage.setItem(KUNCI_GRUP, JSON.stringify(baru));
      return baru;
    });
  }

  return (
    <SidebarContext.Provider value={{ terbuka, toggle, openGroups, toggleGroup }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar harus dipakai di dalam SidebarProvider");
  return ctx;
}
