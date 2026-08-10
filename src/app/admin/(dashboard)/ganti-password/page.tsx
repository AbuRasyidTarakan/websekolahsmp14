import { GantiPasswordForm } from "@/components/admin/ganti-password-form";

export default function GantiPasswordPage() {
  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl font-bold">Ganti Password</h1>
      <p className="mt-1 text-sm text-foreground/60">Password baru berlaku langsung untuk login berikutnya.</p>
      <GantiPasswordForm />
    </div>
  );
}
