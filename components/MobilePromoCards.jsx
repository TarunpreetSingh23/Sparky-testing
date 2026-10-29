"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function MobilePromoCards() {
  const router = useRouter();

  // Authentic promotional cards mapped to real existing routes
  const promoItems = [
    {
      id: "festive-beauty",
      title: "Festive Salon",
      tagline: "Facials & Waxing",
      image: "/images/goldfacial.webp",
      route: "/beauty",
      badge: "POPULAR",
      accent: "#C2306B",
      bgGradient: "linear-gradient(135deg, #FFF0F6 0%, #FFFFFF 100%)",
    },
    {
      id: "home-deep-cleaning",
      title: "Deep Cleaning",
      tagline: "Kitchen & Washrooms",
      image: "/images/deepcleanup.webp",
      route: "/clean",
      badge: "VERIFIED",
      accent: "#073D50",
      bgGradient: "linear-gradient(135deg, #EFF8FB 0%, #FFFFFF 100%)",
    },
    {
      id: "event-decor",
      title: "Event Decor",
      tagline: "Balloon & Floral Sets",
      image: "/images/curlsandwaves.webp",
      route: "/eventdecor",
      badge: "CUSTOM",
      accent: "#8E4FD6",
      bgGradient: "linear-gradient(135deg, #F5EFFB 0%, #FFFFFF 100%)",
    },
    {
      id: "ac-repairs",
      title: "AC & Repairs",
      tagline: "Service in 30 Mins",
      image: "/images/mobile-ac.png",
      route: "/services/ac-repair",
      badge: "INSTANT",
      accent: "#C2306B",
      bgGradient: "linear-gradient(135deg, #FFF4EE 0%, #FFFFFF 100%)",
    },
  ];

  return (
    <section
      aria-label="Promotional Services"
      className="block md:hidden px-3.5 pt-3 pb-1"
    >
      <div className="flex items-center justify-between mb-2 px-0.5">
        <h3 className="text-[13px] font-black uppercase tracking-wider text-[#25232A]">
          Trending Highlights
        </h3>
        <span className="text-[10px] font-bold text-[#77717A]">Curated for you</span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {promoItems.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(item.route)}
            style={{ background: item.bgGradient }}
            className="flex-shrink-0 w-[140px] rounded-[18px] border border-[#EAE7E9] p-2.5 shadow-[0_2px_8px_rgba(37,35,42,0.03)] cursor-pointer active:scale-95 transition-transform"
          >
            {/* Top row: Badge */}
            <div className="flex items-center justify-between mb-1.5">
              <span
                style={{ color: item.accent }}
                className="text-[8px] font-extrabold uppercase tracking-widest bg-white/90 px-1.5 py-0.5 rounded-md border border-[#EAE7E9]"
              >
                {item.badge}
              </span>
              <ArrowRight size={11} className="text-[#77717A]" />
            </div>

            {/* Middle: Service Image */}
            <div className="relative h-[72px] w-full rounded-[12px] overflow-hidden bg-white mb-2">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="120px"
                className="object-cover object-center"
              />
            </div>

            {/* Bottom: Title & Tagline */}
            <h4 className="text-[12px] font-extrabold text-[#25232A] leading-tight truncate">
              {item.title}
            </h4>
            <p className="text-[10px] font-medium text-[#77717A] leading-tight truncate mt-0.5">
              {item.tagline}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
