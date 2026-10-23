"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Sparkles, ShieldCheck } from "lucide-react";

export default function BeautyBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 3 Distinct Banner Data tailored to your theme
  const banners = [
    {
      id: 1,
      badge: "Your self-care moment",
      title1: "A little beauty.",
      title2: "A lot of you.",
      subtitle: "Salon favourites and feel-good rituals, right at your doorstep.",
      btnText: "Explore Beauty",
      btnHref: "/beauty",
      image: "/images/beauty-banner.jpg",
      cardTitle: "Beauty, made personal",
      cardSubtitle: "Your time to unwind",
      gradient: "from-[#FFF2F7] via-[#FCE6EF] to-[#F8D5E4]",
      accentColor: "from-[#E98CB0] to-[#C2306B]",
    },
    {
      id: 2,
      badge: "Glow from within",
      title1: "Expert care,",
      title2: "Zero hassle.",
      subtitle: "Professional stylists and premium products delivered to your home.",
      btnText: "Book A Session",
      btnHref: "/beauty/book",
      image: "/images/beauty-banner-2.jpg", // Replace with your second image path
      cardTitle: "Verified Professionals",
      cardSubtitle: "Safe & Sanitized",
      gradient: "from-[#FDF2F8] via-[#FCE7F3] to-[#FBCFE8]",
      accentColor: "from-[#F472B6] to-[#DB2777]",
    },
    {
      id: 3,
      badge: "Exclusive Savings",
      title1: "Radiant skin,",
      title2: "Special treats.",
      subtitle: "Unwind with customized facials and spa treatments curated for you.",
      btnText: "Claim Offers",
      btnHref: "/offers",
      image: "/images/beauty-banner-3.jpg", // Replace with your third image path
      cardTitle: "Pamper Yourself",
      cardSubtitle: "Up to 30% Off",
      gradient: "from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3]",
      accentColor: "from-[#FB7185] to-[#E11D48]",
    },
  ];

  // Auto-scroll logic (every 5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, banners.length]);

  return (
    <section className="w-full px-3 pt-3 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[24px] border border-[#F3DCE6] bg-white shadow-[0_8px_30px_rgba(194,48,107,0.08)]">

        {/* PROMO STRIP */}
        <div className="flex min-h-[42px] items-center justify-between gap-3 bg-[#2B1B2E] px-4 py-2 text-white sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#E98CB0] to-[#C2306B] text-sm font-black text-white">
              %
            </span>
            <p className="truncate text-[11px] font-semibold sm:text-sm">
              Use <span className="text-[#F3A7C5]">WELCOME10</span> for a little extra glow
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText("WELCOME10")}
            className="shrink-0 rounded-full px-1 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white underline decoration-[#E98CB0] underline-offset-4 transition-colors hover:text-[#F3A7C5] sm:text-xs cursor-pointer"
          >
            Copy Code
          </button>
        </div>

        {/* HERO BANNER CAROUSEL CONTAINER */}
        <div 
          className="relative m-2.5 overflow-hidden rounded-[19px] sm:m-3.5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel Track */}
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner, idx) => (
              <div key={banner.id} className="min-w-full flex-shrink-0 relative isolate">
                
                {/* Background Gradient */}
                <div className={`absolute inset-0 -z-20 bg-gradient-to-br ${banner.gradient}`} />

                <div className="grid min-h-[210px] grid-cols-1 sm:min-h-[245px] sm:grid-cols-2">

                  {/* LEFT CONTENT */}
                  <div className="relative z-10 flex flex-col items-start justify-center px-5 py-6 sm:px-7 sm:py-8 lg:px-10">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/65 px-3 py-1.5 shadow-sm backdrop-blur-lg">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C2306B]" />
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#A51F56] sm:text-[10px]">
                        {banner.badge}
                      </span>
                    </div>

                    <h2 className="max-w-sm text-[25px] font-black leading-[1.08] tracking-tight text-[#2B1B2E] sm:text-[29px] lg:text-[36px]">
                      {banner.title1}
                      <br />
                      <span className="bg-gradient-to-r from-[#C2306B] to-[#A51F56] bg-clip-text text-transparent">
                        {banner.title2}
                      </span>
                    </h2>

                    <p className="mt-2 max-w-[270px] text-[11px] leading-relaxed text-[#684B5A] sm:text-sm">
                      {banner.subtitle}
                    </p>

                    <Link
                      href={banner.btnHref}
                      className="group relative mt-5 inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/40 bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56] px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[0_5px_16px_rgba(194,48,107,0.23)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(194,48,107,0.32)] active:scale-[0.98] sm:text-xs"
                    >
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
                      <span className="relative">{banner.btnText}</span>
                      <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>

                  {/* RIGHT IMAGE */}
                  <div className="relative min-h-[155px] overflow-hidden sm:min-h-full">
                    <img
                      src={banner.image}
                      alt={banner.cardTitle}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />

                    {/* Image blending */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B1B2E]/30 via-transparent to-white/10 sm:bg-gradient-to-r sm:from-[#FCE6EF]/35 sm:via-transparent sm:to-transparent" />

                    {/* Floating glass label */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-2xl border border-white/40 bg-white/65 px-3 py-2 shadow-lg backdrop-blur-xl sm:bottom-4 sm:left-4 sm:right-4">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#A51F56]">
                          {banner.cardSubtitle}
                        </p>
                        <p className="mt-0.5 text-xs font-extrabold text-[#2B1B2E] sm:text-sm">
                          {banner.cardTitle}
                        </p>
                      </div>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br ${banner.accentColor} text-white shadow-md`}>
                        {idx === 0 ? <Heart size={15} fill="currentColor" /> : idx === 1 ? <ShieldCheck size={16} /> : <Sparkles size={16} />}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* CAROUSEL PAGINATION DOTS */}
          <div className="absolute bottom-3 right-5 z-20 hidden items-center gap-1.5 sm:flex">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? "w-6 bg-[#C2306B]" : "w-1.5 bg-white/70 hover:bg-white"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}