"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

// ============================================
// SPARKY BRAND COLORS — edit these as required
// ============================================
const THEME = {
  primary: "#094B66",    // Deep teal
  secondary: "#C0BC91",  // Muted sage/stone
  accent: "#55210A",     // Deep warm brown
  highlight: "#C2306B",  // Sparky rose
  background: "#F7F7F5",
  surface: "#FFFFFF",
  text: "#25232A",
  muted: "#77717A",
  border: "#EAE7E9",
};

const promoItems = [
  {
    id: "festive-beauty",
    title: "Beauty & Care",
    tagline: "Facials, waxing & more",
    image: "/images/goldfacial.webp",
    route: "/beauty",
    color: THEME.highlight,
    background: "#FCF1F5",
  },
  {
    id: "home-deep-cleaning",
    title: "Home Cleaning",
    tagline: "A fresher home, effortlessly",
    image: "/images/deepcleanup.webp",
    route: "/clean",
    color: THEME.primary,
    background: "#EEF5F7",
  },
  {
    id: "event-decor",
    title: "Event Decoration",
    tagline: "Make every occasion special",
    image: "/images/curlsandwaves.webp",
    route: "/eventdecor",
    color: THEME.accent,
    background: "#F7F0EB",
  },
  {
    id: "ac-repairs",
    title: "Home Repairs",
    tagline: "Everyday fixes, made easier",
    image: "/images/mobile-ac.png",
    route: "/services/ac-repair",
    color: "#77724C",
    background: "#F4F3EA",
  },
];

export default function MobilePromoCards() {
  const router = useRouter();

  return (
    <section
      aria-label="Explore Sparky services"
      className="block overflow-hidden bg-white py-4 md:hidden"
      style={{
        "--sparky-primary": THEME.primary,
        "--sparky-secondary": THEME.secondary,
        "--sparky-accent": THEME.accent,
        "--sparky-highlight": THEME.highlight,
      }}
    >
      {/* Section heading */}
      <div className="mb-3 flex items-center justify-between px-4">
        <div>
          <h2
            className="text-[16px] font-bold tracking-[-0.025em]"
            style={{ color: THEME.text }}
          >
            Explore our services
          </h2>
          <p
            className="mt-0.5 text-[11px] font-normal"
            style={{ color: THEME.muted }}
          >
            Everyday care, right at your doorstep
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/beauty")}
          className="inline-flex min-h-9 items-center gap-0.5 rounded-lg px-1 text-[12px] font-semibold transition-opacity active:opacity-60"
          style={{ color: THEME.primary }}
        >
          Explore
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Fixed two-column grid: no horizontal scrolling */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {promoItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => router.push(item.route)}
            aria-label={`Explore ${item.title}`}
            className="group min-w-0 overflow-hidden rounded-[14px] border bg-white text-left transition-transform duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderColor: THEME.border,
              "--tw-ring-color": THEME.primary,
            }}
          >
            {/* Service photography */}
            <div
              className="relative aspect-[1.65/1] w-full overflow-hidden"
              style={{ backgroundColor: item.background }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 767px) 50vw, 0px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />

              {/* Small, understated category label */}
              <span
                className="absolute bottom-2 left-2 max-w-[calc(100%-16px)] truncate rounded-md px-2 py-1 text-[9px] font-semibold"
                style={{
                  backgroundColor: "rgba(255,255,255,0.94)",
                  color: item.color,
                }}
              >
                {item.title}
              </span>
            </div>

            {/* Text area */}
            <div className="flex min-h-[67px] items-center justify-between gap-1.5 px-2.5 py-2">
              <div className="min-w-0">
                <h3
                  className="truncate text-[12px] font-semibold leading-4"
                  style={{ color: THEME.text }}
                >
                  {item.title}
                </h3>

                <p
                  className="mt-1 line-clamp-2 text-[10px] leading-[1.4]"
                  style={{ color: THEME.muted }}
                >
                  {item.tagline}
                </p>
              </div>

              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
                style={{
                  color: item.color,
                  borderColor: THEME.border,
                  backgroundColor: item.background,
                }}
                aria-hidden="true"
              >
                <ChevronRight size={15} strokeWidth={1.8} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}