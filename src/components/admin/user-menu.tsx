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
  peran: string;
}

function inisial(nama: string): string {
  const bagian = nama.trim().split(/\s+/);
  if (bagian.length === 1) return bagian[0].slice(0, 2).toUpperCase();
  return (bagian[0][0] + bagian[1][0]).toUpperCase();
}

export function UserMenu({ namaLengkap, fotoProfil, peran }: UserMenuProps) {
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

  const itemMenu = "flex items-center gap-2.5 px-3 py-2 text-sm text-chrome-fg hover:bg-chrome-hover";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setTerbuka((t) => !t)}
        className="flex items-center gap-2.5 rounded-lg py-1.5 pl-2 pr-3 transition-colors hover:bg-chrome-hover"
      >
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary">
          {fotoProfil ? (
            <Image src={fotoProfil} alt={namaLengkap} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary-foreground">
              {inisial(namaLengkap)}
            </div>
          )}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-tight text-chrome-strong">{namaLengkap}</p>
          <p className="text-xs leading-tight text-chrome-muted">{peran}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-chrome-muted transition-transform ${terbuka ? "rotate-180" : ""}`} />
      </button>

      {terbuka && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-lg border border-chrome-border bg-chrome-bg py-1.5 shadow-lg">
          <Link href="/admin/profil-saya" onClick={() => setTerbuka(false)} className={itemMenu}>
            <UserCircle className="h-4 w-4" /> Profil Saya
          </Link>
          <Link href="/admin/ganti-password" onClick={() => setTerbuka(false)} className={itemMenu}>
            <KeyRound className="h-4 w-4" /> Ganti Password
          </Link>
          <div className="my-1 border-t border-chrome-border" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}
