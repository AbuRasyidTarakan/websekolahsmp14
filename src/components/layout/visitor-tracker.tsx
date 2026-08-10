"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function getVisitorId(): string {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
}

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    const visitorId = getVisitorId();

    supabase.from("kunjungan").insert({ visitor_id: visitorId, halaman: pathname }).then(() => {});
  }, [pathname]);

  return null;
}
