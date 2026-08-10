"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Banner {
  id: string;
  pesan: string;
}

export function EmergencyBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("pengumuman_banner")
      .select("id, pesan")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        const ditutup: string[] = JSON.parse(sessionStorage.getItem("banner_ditutup") ?? "[]");
        setBanners(data.filter((b) => !ditutup.includes(b.id)));
      });
  }, []);

  function tutupBanner(id: string) {
    const ditutup: string[] = JSON.parse(sessionStorage.getItem("banner_ditutup") ?? "[]");
    sessionStorage.setItem("banner_ditutup", JSON.stringify([...ditutup, id]));
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }

  if (banners.length === 0) return null;

  return (
    <div>
      {banners.map((b) => (
        <div
          key={b.id}
          className="flex items-center justify-center gap-3 px-4 py-2 text-center text-sm font-medium text-accent-foreground"
          style={{ backgroundColor: "#E5F553" }}
        >
          <span>{b.pesan}</span>
          <button onClick={() => tutupBanner(b.id)} aria-label="Tutup pengumuman">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
