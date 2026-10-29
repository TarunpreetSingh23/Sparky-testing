"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getActiveCampaigns } from "@/lib/festivalCampaigns";

export default function MobileFestivalHero({ campaigns = null }) {
  const router = useRouter();
  const [activeList, setActiveList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const list =
      campaigns && campaigns.length > 0
        ? campaigns
        : getActiveCampaigns();

    const safeList = Array.isArray(list) ? list : [];

    setActiveList(safeList);
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

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    touchEndX.current = event.changedTouches[0].clientX;

    const difference = touchStartX.current - touchEndX.current;

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
      className="block md:hidden bg-white px-3 pt-3 pb-1"
    >
      <div
        className="relative isolate overflow-hidden rounded-[16px] border border-[#EAD9D5] bg-[#F5E4DE]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full-width editorial banner image */}
        <div className="absolute inset-0 -z-20">
          <Image
            src={current.image || "/images/goldfacial.webp"}
            alt={current.title || "Sparky festive beauty services"}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 0px"
            className="object-cover object-center"
          />
        </div>

        {/* Soft text-side fade; keeps the image natural */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#F8E8E3] via-[#F8E8E3]/95 via-45% to-transparent" />

        <div className="relative flex min-h-[190px] items-center px-4 py-5">
          <div className="w-[72%] max-w-[270px]">
            {current.badge && (
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.19em] text-[#6D4B48]">
                {current.badge}
              </p>
            )}

            <h2 className="max-w-[230px] text-[25px] font-bold leading-[1.08] tracking-[-0.045em] text-[#302322]">
              {current.title}
            </h2>

            {current.subtitle && (
              <p className="mt-2 max-w-[210px] text-[11px] leading-[1.45] text-[#62504D]">
                {current.subtitle}
              </p>
            )}

            <button
              type="button"
              onClick={() => router.push(current.ctaLink || "/beauty")}
              className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-full bg-[#C2306B] px-3.5 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#A92359] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2306B] focus-visible:ring-offset-2"
            >
              {current.ctaText || "Explore services"}
              <ChevronRight size={14} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* Minimal carousel pagination */}
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
                  ? "w-4 bg-[#C2306B]"
                  : "w-1.5 bg-[#D8C9CD]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}