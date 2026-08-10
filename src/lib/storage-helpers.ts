// Public URL Supabase Storage formatnya:
// https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
// Fungsi ini ekstrak bagian {path}-nya saja, dipakai untuk hapus file dari storage.

export function extractStoragePath(url: string | null | undefined, bucket: string): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}
