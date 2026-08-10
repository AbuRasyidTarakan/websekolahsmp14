"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email atau kata sandi salah. Coba lagi.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-lg border border-border p-6">
        <h1 className="font-display text-xl font-bold">Login Guru/Admin</h1>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Kata Sandi</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-border px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary py-2 font-medium text-primary-foreground disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-foreground/60">
          Belum punya akun?{" "}
          <a href="/register" className="font-medium text-primary hover:underline">
            Daftar jadi editor
          </a>
        </p>
      </form>
    </main>
  );
}
