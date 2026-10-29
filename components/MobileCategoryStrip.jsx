"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles, Home, Scissors, Wrench, PartyPopper, Check } from "lucide-react";

export default function MobileCategoryStrip({ activeCategory = "all", onSelectCategory = null }) {
  const router = useRouter();
  const pathname = usePathname();

  // Existing core Sparky service categories
  const categories = [
    {
      id: "all",
      name: "All Services",
      image: "/images/sremovebg.png",
      href: "/",
      isHome: true,
    },
    {
      id: "beauty",
      name: "Salon & Beauty",
      image: "/images/CATEGORY-ICONS/facial.png",
      href: "/beauty",
    },
    {
      id: "clean",
      name: "Home Cleaning",
      image: "/images/CATEGORY-ICONS/cleanup.png",
      href: "/clean",
    },
    {
      id: "eventdecor",
      name: "Event Decor",
      image: "/images/CATEGORY-ICONS/makeup.png",
      href: "/eventdecor",
    },
    {
      id: "haute",
      name: "Boutique",
      image: "/images/CATEGORY-ICONS/waxing.png",
      href: "/haute",
    },
    {
      id: "ac-repair",
      name: "AC & Repairs",
      image: "/images/mobile-ac.png",
      href: "/services/ac-repair",
    },
    {
      id: "hair",
      name: "Hair & Spa",
      image: "/images/CATEGORY-ICONS/hair.png",
      href: "/beauty?category=HAIR",
    },
    {
      id: "manicure",
      name: "Nails & Mani",
      image: "/images/CATEGORY-ICONS/manicure.png",
      href: "/beauty?category=MANICURE",
    },
  ];

  const handleCategoryClick = (cat) => {
    if (onSelectCategory && cat.isHome) {
      onSelectCategory("all");
    } else if (onSelectCategory && !cat.href.startsWith("/clean") && !cat.href.startsWith("/eventdecor") && !cat.href.startsWith("/haute") && !cat.href.startsWith("/services/")) {
      onSelectCategory(cat.id);
    } else {
      router.push(cat.href);
    }
  };

  return (
    <nav
      aria-label="Category Navigation"
      className="block md:hidden w-full bg-white border-b border-[#EAE7E9] py-2.5 shadow-[0_2px_8px_rgba(37,35,42,0.02)]"
    >
      <div className="flex items-center gap-3 overflow-x-auto px-3.5 no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const isActive =
            activeCategory === cat.id ||
            (cat.href !== "/" && pathname === cat.href) ||
            (cat.id === "all" && pathname === "/" && activeCategory === "all");

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className="flex shrink-0 flex-col items-center gap-1.5 focus:outline-none cursor-pointer group"
            >
              {/* Icon Container with active border and subtle indicator */}
              <div
                className={`relative flex h-[58px] w-[58px] items-center justify-center rounded-[18px] transition-all duration-200 ${
                  isActive
                    ? "bg-[#FFF0F6] border-2 border-[#C2306B] shadow-[0_2px_10px_rgba(194,48,107,0.18)]"
                    : "bg-[#F7F7F5] border border-[#EAE7E9] group-hover:bg-[#F2EFF1]"
                }`}
              >
                <div className="relative h-9 w-9 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>

                {/* Subtle active checkmark or indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-[#C2306B]" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-bold text-center tracking-tight max-w-[62px] leading-tight ${
                  isActive ? "text-[#C2306B]" : "text-[#25232A]"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
