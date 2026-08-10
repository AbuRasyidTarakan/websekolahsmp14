import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SMP Negeri 14 Tarakan",
    template: "%s | SMP Negeri 14 Tarakan",
  },
  description: "Portal berita dan informasi kegiatan SMP Negeri 14 Tarakan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${jakartaSans.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
