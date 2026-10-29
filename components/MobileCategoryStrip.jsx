"use client";

import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function MobileCategoryStrip({
  activeCategory = "all",
  onSelectCategory = null,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categories = [
    {
      id: "beauty",
      name: "Facials",
      image: "/images/CATEGORY-ICONS/facial.png",
      href: "/beauty?category=FACIAL",
    },
    {
      id: "clean",
      name: "Cleanup",
      image: "/images/CATEGORY-ICONS/cleanup.png",
      href: "/beauty?category=CLEANUP",
    },
    {
      id: "eventdecor",
      name: "Makeup",
      image: "/images/CATEGORY-ICONS/makeup.png",
      href: "/beauty?category=MAKEUP",
    },
    {
      id: "haute",
      name: "Waxing",
      image: "/images/CATEGORY-ICONS/waxing.png",
      href: "/beauty?category=WAXING",
    },
    {
      id: "hair",
      name: "Hair",
      image: "/images/CATEGORY-ICONS/hair.png",
      href: "/beauty?category=HAIR",
    },
    {
      id: "manicure",
      name: "Nails",
      image: "/images/CATEGORY-ICONS/manicure.png",
      href: "/beauty?category=MANICURE",
    },
  ];

  const currentCategory = searchParams.get("category");

  const handleCategoryClick = (cat) => {
    if (onSelectCategory && pathname === "/") {
      onSelectCategory(cat.id);
      return;
    }

    router.push(cat.href);
  };

  return (
    <nav
      aria-label="Beauty service categories"
      className="block md:hidden w-full overflow-hidden border-b border-[#F0EAED] bg-white"
    >
      <div
        className="flex w-full items-start justify-between gap-1 px-2 pt-3 pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => {
          const isActive =
            activeCategory === cat.id ||
            (pathname === "/beauty" &&
              currentCategory?.toLowerCase() ===
                cat.href.split("category=")[1].toLowerCase());

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              aria-label={`Explore ${cat.name}`}
              aria-pressed={isActive}
              className="group relative flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#C2306B] focus-visible:ring-offset-2"
            >
              <motion.div
                animate={{ scale: isActive ? 1.03 : 1 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                }}
                className={`relative h-[clamp(42px,12vw,54px)] w-[clamp(42px,12vw,54px)] shrink-0 overflow-hidden rounded-full border bg-[#FAF7F8] ${
                  isActive
                    ? "border-[#C2306B]"
                    : "border-[#F0EAED]"
                }`}
              >
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes="54px"
                  className="object-cover"
                />
              </motion.div>

              <span
                className={`max-w-full truncate text-center text-[10px] min-[380px]:text-[11px] leading-tight ${
                  isActive
                    ? "font-semibold text-[#C2306B]"
                    : "font-medium text-[#514B52]"
                }`}
              >
                {cat.name}
              </span>

              <div className="relative h-[2px] w-full">
                {isActive && (
                  <motion.span
                    layoutId="sparky-category-indicator"
                    className="absolute left-1/2 top-0 h-[2px] w-7 -translate-x-1/2 rounded-full bg-[#C2306B]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}