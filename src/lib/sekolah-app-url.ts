// Fungsi murni (tanpa akses server) — boleh dipakai di Client Component maupun Server Component.

/**
 * Merapikan input URL dari form admin: kalau lupa menulis "https://" otomatis ditambahkan.
 * Mengembalikan null kalau bukan URL http/https yang valid.
 */
export function normalisasiUrl(input: string): string | null {
  const teks = input.trim();
  if (!teks) return null;
  const dengan = /^[a-z][a-z0-9+.-]*:/i.test(teks) ? teks : `https://${teks}`;
  try {
    const u = new URL(dengan);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/**
 * Dipakai SAAT MENAMPILKAN link di halaman publik. Hanya http/https yang lolos —
 * "javascript:..." atau skema lain yang terlanjur tersimpan di database akan ditolak
 * (mencegah XSS lewat atribut href).
 */
export function urlAman(url: string): string | null {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

/** "https://piketsmp14.vercel.app/path" -> "piketsmp14.vercel.app" */
export function domainDari(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
