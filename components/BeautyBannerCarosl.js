"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function BeautyBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 2 Distinct Scrollable Banner Data matching the clean layout in the reference screenshot
  const banners = [
    {
      id: 1,
      title1: "Best care.",
      title2: "Best prices.",
      subtitle: "Top-rated experts at your door, in under 60 minutes.",
      btnText: "Book now",
      btnHref: "/beauty",
      image: "/images/beauty-banner.jpg",
    },
    {
      id: 2,
      title1: "Glow more.",
      title2: "Spend less.",
      subtitle: "Exclusive salon packages customized just for your wellness.",
      btnText: "Explore offers",
      btnHref: "/beauty/offers",
      image: "/images/beauty-banner-2.jpg",
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
      {/* Outer Transparent or Clean Container */}
      <div 
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-white border border-[#F1DFE8] shadow-[0_8px_30px_rgba(105,43,79,0.06)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Carousel Track */}
        <div 
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full flex-shrink-0 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center min-h-[220px] sm:min-h-[250px]">
                
                {/* LEFT CONTENT */}
                <div className="flex flex-col justify-center px-6 py-6 sm:px-8 lg:px-10 z-10">
                  <h2 className="text-[28px] sm:text-[34px] font-black leading-[1.08] tracking-tight text-[#2B1B2E]">
                    {banner.title1}
                    <br />
                    {banner.title2}
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-[#8D788D] max-w-[260px]">
                    {banner.subtitle}
                  </p>

                  <div className="mt-5">
                    <Link
                      href={banner.btnHref}
                      className="inline-flex items-center justify-center rounded-full bg-white border border-[#F1DFE8] px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#2B1B2E] shadow-[0_4px_12px_rgba(105,43,79,0.08)] transition-all duration-300 hover:bg-[#FFF4F8] hover:text-[#C2306B] hover:border-[#E98CB0] active:scale-95"
                    >
                      {banner.btnText}
                    </Link>
                  </div>
                </div>

                {/* RIGHT IMAGE WITH CURVED ARCH/MASK EFFECT */}
                <div className="relative h-[180px] sm:h-full w-full overflow-hidden">
                  <div 
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      borderTopLeftRadius: "120px",
                      borderBottomLeftRadius: "40px",
                      overflow: "hidden"
                    }}
                  >
                    <img
                      src={banner.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    {/* Soft Pink Blending Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent sm:from-white/80 sm:via-transparent" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* CAROUSEL PAGINATION DOTS */}
        <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? "w-5 bg-[#C2306B]" : "w-1.5 bg-[#F1DFE8] hover:bg-[#C2306B]/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}