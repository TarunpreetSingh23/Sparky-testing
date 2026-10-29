"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getActiveCampaigns } from "@/lib/festivalCampaigns";

// ========================================
// SPARKY FESTIVAL THEME — EDIT COLORS HERE
// ========================================
const FESTIVAL_THEME = {
  beauty: "#FCF1F5",
  cleaning: "#EEF5F7",
  events: "#F7F0EB",
  home: "#F4F3EA",

  primary: "#094B66",
  accent: "#55210A",
  rose: "#C2306B",
  text: "#25232A",
  muted: "#77717A",
  border: "#EAE7E9",
};

const FALLBACK_BACKGROUNDS = [
  FESTIVAL_THEME.beauty,
  FESTIVAL_THEME.cleaning,
  FESTIVAL_THEME.events,
  FESTIVAL_THEME.home,
];

export default function MobileFestivalHero({ campaigns = null }) {
  const router = useRouter();
  const [activeList, setActiveList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const list =
      campaigns && campaigns.length > 0
        ? campaigns
        : getActiveCampaigns();

    setActiveList(Array.isArray(list) ? list : []);
    setCurrentIndex(0);
  }, [campaigns]);

  useEffect(() => {
    if (activeList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeList.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [activeList.length]);

  if (!activeList.length) return null;

  const current = activeList[currentIndex] || activeList[0];

  const fallbackBackground =
    FALLBACK_BACKGROUNDS[currentIndex % FALLBACK_BACKGROUNDS.length];

  const backgroundColor = current.background || fallbackBackground;

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    const difference =
      touchStartX.current - event.changedTouches[0].clientX;

    if (Math.abs(difference) < 45 || activeList.length <= 1) return;

    setCurrentIndex((prev) =>
      difference > 0
        ? (prev + 1) % activeList.length
        : (prev - 1 + activeList.length) % activeList.length
    );
  };

  return (
    <section
      aria-label="Featured festival offers"
      className="block bg-white px-3 pt-3 pb-1 md:hidden"
    >
      <div
        className="relative isolate overflow-hidden rounded-[16px] border transition-colors duration-500"
        style={{
          backgroundColor,
          borderColor: FESTIVAL_THEME.border,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image blended into the right side */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[53%]">
          <Image
            src={current.image || "/images/goldfacial.webp"}
            alt={current.title || "Sparky festival services"}
            fill
            priority={currentIndex === 0}
            sizes="(max-width: 767px) 53vw, 0px"
            className="object-cover object-center"
          />

          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${backgroundColor} 0%, ${backgroundColor}20 45%, transparent 100%)`,
            }}
          />
        </div>

        {/* Text area */}
        <div className="relative z-10 flex min-h-[185px] items-center px-4 py-5">
          <div className="w-[72%] max-w-[270px]">
            {current.badge && (
              <p
                className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: FESTIVAL_THEME.primary }}
              >
                {current.badge}
              </p>
            )}

            <h2
              className="max-w-[230px] text-[23px] font-bold leading-[1.12] tracking-[-0.035em]"
              style={{ color: FESTIVAL_THEME.text }}
            >
              {current.title}
            </h2>

            {current.subtitle && (
              <p
                className="mt-2 max-w-[205px] text-[11px] leading-[1.5]"
                style={{ color: FESTIVAL_THEME.muted }}
              >
                {current.subtitle}
              </p>
            )}

            <button
              type="button"
              onClick={() => router.push(current.ctaLink || "/beauty")}
              className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3.5 py-2 text-[11px] font-semibold text-white transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: FESTIVAL_THEME.primary,
                "--tw-ring-color": FESTIVAL_THEME.primary,
              }}
            >
              {current.ctaText || "Explore services"}
              <ChevronRight size={14} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* Minimal campaign indicators */}
      {activeList.length > 1 && (
        <div className="flex h-5 items-center justify-center gap-1.5">
          {activeList.map((campaign, index) => (
            <button
              key={campaign.id || index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Show campaign ${index + 1}`}
              aria-current={currentIndex === index ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-4"
                  : "w-1.5 bg-[#D8D5C9]"
              }`}
              style={
                currentIndex === index
                  ? { backgroundColor: FESTIVAL_THEME.rose }
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}