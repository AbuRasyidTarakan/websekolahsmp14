import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { DeleteAlbumButton } from "@/components/admin/delete-album-button";

export default async function KelolaGaleriPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  let query = supabase
    .from("galeri_album")
    .select("id, judul_album, cover_url, created_at, penulis_id, galeri_foto(id, url_foto)")
    .order("created_at", { ascending: false });

  if (profile?.role !== "super_admin") {
    query = query.eq("penulis_id", user!.id);
  }

  const { data: albumList } = await query;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Kelola Galeri</h1>
        <Link href="/admin/galeri/baru">
          <Button>+ Album Baru</Button>
        </Link>
      </div>

      {albumList?.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border p-10 text-center text-foreground/50">
          Belum ada album. Klik &quot;+ Album Baru&quot; untuk mulai upload foto kegiatan.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {albumList?.map((album) => {
            // @ts-expect-error - relasi array di runtime
            const fotoList = (album.galeri_foto ?? []) as { url_foto: string }[];
            const urlFotoList = fotoList.map((f) => f.url_foto);
            if (album.cover_url) urlFotoList.push(album.cover_url);

            return (
              <div key={album.id} className="relative overflow-hidden rounded-lg border border-border">
                {(profile?.role === "super_admin" || album.penulis_id === user!.id) && (
                  <DeleteAlbumButton albumId={album.id} judulAlbum={album.judul_album} urlFotoList={urlFotoList} />
                )}
                <div className="relative aspect-square bg-primary/10">
                  {album.cover_url && (
                    <Image src={album.cover_url} alt={album.judul_album} fill className="object-cover" />
                  )}
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold">{album.judul_album}</p>
                  <p className="mt-1 text-xs text-foreground/50">{fotoList.length} foto</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
