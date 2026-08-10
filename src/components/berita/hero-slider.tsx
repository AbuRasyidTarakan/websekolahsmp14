"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface HeroBerita {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  thumbnail_url: string | null;
  kategori: { nama: string; warna: string } | null;
}

export function HeroSlider({ items }: { items: HeroBerita[] }) {
  if (items.length === 0) return null;

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop={items.length > 1}
        className="hero-swiper h-[280px] w-full sm:h-[380px] lg:h-[480px]"
      >
        {items.map((b) => (
          <SwiperSlide key={b.id}>
            <Link href={`/berita/${b.slug}`} className="group relative block h-full w-full">
              {b.thumbnail_url ? (
                <Image
                  src={b.thumbnail_url}
                  alt={b.judul}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-primary" />
              )}

              {/* Overlay gradient gelap supaya teks terbaca */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                <div className="mx-auto max-w-6xl">
                  {b.kategori && (
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: b.kategori.warna }}
                    >
                      {b.kategori.nama}
                    </span>
                  )}
                  <h2 className="mt-3 font-display text-xl font-bold leading-tight text-white sm:text-2xl lg:text-4xl">
                    {b.judul}
                  </h2>
                  {b.ringkasan && (
                    <p className="mt-2 hidden max-w-2xl text-sm text-white/80 sm:block">
                      {b.ringkasan}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
