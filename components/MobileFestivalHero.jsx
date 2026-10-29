"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Sparkles } from "lucide-react";
import { getActiveCampaigns } from "@/lib/festivalCampaigns";

export default function MobileFestivalHero({ campaigns = null }) {
  const router = useRouter();
  const [activeList, setActiveList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const list = campaigns && campaigns.length > 0 ? campaigns : getActiveCampaigns();
    setActiveList(list);
  }, [campaigns]);

  // Subtle auto-advance if multiple campaigns exist
  useEffect(() => {
    if (activeList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeList.length]);

  if (!activeList || activeList.length === 0) return null;

  const current = activeList[currentIndex] || activeList[0];

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left -> next
        setCurrentIndex((prev) => (prev + 1) % activeList.length);
      } else {
        // Swiped right -> prev
        setCurrentIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
      }
    }
  };

  return (
    <section
      aria-label="Festive Promotions"
      className="block md:hidden px-3.5 pt-3 pb-1"
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          background: current.background || "linear-gradient(135deg, #2D0819 0%, #5E1437 52%, #C2306B 100%)",
        }}
        className="relative overflow-hidden rounded-[24px] border border-white/10 shadow-[0_8px_24px_rgba(43,27,46,0.12)] transition-all duration-500"
      >
        {/* Subtle decorative glow & pattern */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-amber-400/10 blur-xl" />

        <div className="relative z-10 flex min-h-[175px] items-center justify-between p-4">
          {/* Left Text Content */}
          <div className="flex flex-col justify-center pr-3 max-w-[62%]">
            {/* Festive Badge */}
            {current.badge && (
              <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 mb-2 border border-white/25">
                <Sparkles size={11} className="text-amber-300" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  {current.badge}
                </span>
              </div>
            )}

            {/* Campaign Headline */}
            <h3 className="text-[17px] font-black leading-[1.2] text-white tracking-tight drop-shadow-xs">
              {current.title}
            </h3>

            {/* Subtitle */}
            <p className="mt-1.5 text-[11px] font-medium leading-[1.35] text-white/85 line-clamp-2">
              {current.subtitle}
            </p>

            {/* Action CTA */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => router.push(current.ctaLink || "/beauty")}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-black text-[#2B1B2E] shadow-md transition-all active:scale-95 hover:bg-[#FFF7F3] cursor-pointer"
              >
                <span>{current.ctaText || "Explore Services"}</span>
                <ChevronRight size={13} className="text-[#C2306B]" strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Right Image Container with authentic arch crop */}
          <div className="relative h-[145px] w-[38%] shrink-0">
            <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-white/20 shadow-md">
              <Image
                src={current.image || "/images/goldfacial.webp"}
                alt={current.title}
                fill
                sizes="150px"
                className="object-cover object-center"
                priority
              />
              {/* Subtle inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Tag overlay */}
              {current.tag && (
                <div className="absolute bottom-1.5 left-1.5 right-1.5 rounded-md bg-[#2B1B2E]/80 backdrop-blur-xs px-1.5 py-0.5 text-center text-[9px] font-bold text-white shadow-xs">
                  {current.tag}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots if multiple campaigns exist */}
        {activeList.length > 1 && (
          <div className="absolute bottom-2 left-4 z-20 flex items-center gap-1">
            {activeList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
