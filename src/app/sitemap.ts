import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const halamanStatis: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/berita`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/galeri`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/agenda`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/profil-sekolah`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/unduhan`, changeFrequency: "weekly", priority: 0.6 },
  ];

  const [{ data: beritaList }, { data: albumList }] = await Promise.all([
    supabase.from("berita").select("slug, published_at").eq("status", "published"),
    supabase.from("galeri_album").select("id, created_at"),
  ]);

  const halamanBerita: MetadataRoute.Sitemap = (beritaList ?? []).map((b) => ({
    url: `${baseUrl}/berita/${b.slug}`,
    lastModified: b.published_at ? new Date(b.published_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const halamanGaleri: MetadataRoute.Sitemap = (albumList ?? []).map((a) => ({
    url: `${baseUrl}/galeri/${a.id}`,
    lastModified: new Date(a.created_at),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...halamanStatis, ...halamanBerita, ...halamanGaleri];
}
