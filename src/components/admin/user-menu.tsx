"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { KeyRound, UserCircle, LogOut, ChevronDown } from "lucide-react";

interface UserMenuProps {
  namaLengkap: string;
  fotoProfil: string | null;
}

export function UserMenu({ namaLengkap, fotoProfil }: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();
  const [terbuka, setTerbuka] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickLuar(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setTerbuka(false);
    }
    document.addEventListener("mousedown", handleClickLuar);
    return () => document.removeEventListener("mousedown", handleClickLuar);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setTerbuka((t) => !t)} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-accent/10">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-primary/10">
          {fotoProfil ? (
            <Image src={fotoProfil} alt={namaLengkap} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
              {namaLengkap.charAt(0)}
            </div>
          )}
        </div>
        <span className="hidden text-sm font-medium sm:inline">{namaLengkap.split(" ")[0]}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-foreground/40 transition-transform ${terbuka ? "rotate-180" : ""}`} />
      </button>

      {terbuka && (
        <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border border-border bg-background py-1 shadow-lg">
          <Link
            href="/admin/profil-saya"
            onClick={() => setTerbuka(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary"
          >
            <UserCircle className="h-4 w-4" /> Profil Saya
          </Link>
          <Link
            href="/admin/ganti-password"
            onClick={() => setTerbuka(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary"
          >
            <KeyRound className="h-4 w-4" /> Ganti Password
          </Link>
          <div className="my-1 border-t border-border" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}
