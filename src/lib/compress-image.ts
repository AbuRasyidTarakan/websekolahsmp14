// Kompresi gambar di browser SEBELUM upload — kunci supaya kuota gratis
// Supabase Storage (1GB) & bandwidth (5GB/bulan) cukup untuk skala sekolah.
// Resize maks lebar 1200px + convert ke WebP kualitas 80%.

export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<File> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tidak bisa memproses gambar di browser ini.");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Gagal mengompres gambar."))),
      "image/webp",
      quality
    );
  });

  const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], newName, { type: "image/webp" });
}
