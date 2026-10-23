"use client";

import React, { useState } from "react";
import { Star, Check } from "lucide-react";

export default function ValueComboPackages() {
  // Track added state for each combo item
  const [addedItems, setAddedItems] = useState({});

  const handleAdd = (id) => {
    setAddedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const combos = [
    {
      id: 1,
      title: "Glow Facial + Pedicure + Hair Spa",
      subtitle: "Custom herbal facial, therapeutic head massage...",
      rating: 4.97,
      reviews: 890,
      price: 1199,
      originalPrice: 1599,
      image: "/images/beauty-banner.jpg", // Replace with your image
    },
    {
      id: 2,
      title: "Manicure + Express Clean-up + Waxing",
      subtitle: "Nail shaping, hydrating mask & smooth waxing...",
      rating: 4.88,
      reviews: 412,
      price: 849,
      originalPrice: 1099,
      image: "/images/beauty-banner-2.jpg", // Replace with your image
    },
    {
      id: 3,
      title: "Advanced Hair Treatment + Blowout",
      subtitle: "Deep conditioning root serum & glossy finish styling...",
      rating: 4.95,
      reviews: 640,
      price: 1499,
      originalPrice: 1898,
      image: "/images/beauty-banner-3.jpg", // Replace with your image
    },
  ];

  return (
    <section className="w-full px-3 py-6 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-[#2B1B2E] sm:text-2xl">
              Value Combo Packages
            </h2>
            <p className="mt-0.5 text-xs font-medium text-[#684B5A] sm:text-sm">
              Multi-service savings crafted for your home & beauty
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#FFF2F7] border border-[#F3DCE6] px-3 py-1 text-xs font-bold text-[#C2306B] shadow-sm">
            Save up to ₹400
          </span>
        </div>

        {/* COMBO LIST */}
        <div className="flex flex-col gap-4">
          {combos.map((combo) => {
            const isAdded = addedItems[combo.id];
            return (
              <div
                key={combo.id}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[22px] border border-[#F3DCE6] bg-white p-4 shadow-[0_4px_20px_rgba(194,48,107,0.05)] transition-all duration-300 hover:shadow-[0_6px_24px_rgba(194,48,107,0.12)]"
              >
                {/* LEFT: Image & Details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Thumbnail Image */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[16px] bg-[#FFF2F7] sm:h-28 sm:w-28">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B1B2E]">
                      <Star size={14} className="fill-[#FACC15] text-[#FACC15]" />
                      <span>{combo.rating}</span>
                      <span className="font-normal text-[#684B5A]">({combo.reviews})</span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-1 truncate text-sm font-black text-[#2B1B2E] sm:text-base">
                      {combo.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="mt-0.5 line-clamp-1 text-xs text-[#684B5A] sm:max-w-md">
                      {combo.subtitle}
                    </p>

                    {/* Price section for Mobile */}
                    <div className="mt-2 flex items-baseline gap-2 sm:hidden">
                      <span className="text-base font-black text-[#2B1B2E]">
                        ₹{combo.price}
                      </span>
                      <span className="text-xs font-medium text-[#A57C8F] line-through">
                        ₹{combo.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Price & Add Button (Desktop alignment / Row layout) */}
                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 border-t border-[#F3DCE6]/50 pt-3 sm:border-t-0 sm:pt-0">
                  
                  {/* Price (Desktop) */}
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-lg font-black text-[#2B1B2E]">
                      ₹{combo.price}
                    </span>
                    <span className="text-xs font-medium text-[#A57C8F] line-through">
                      ₹{combo.originalPrice}
                    </span>
                  </div>

                  {/* ADD / ADDED Button styled with your pink theme */}
                  <button
                    type="button"
                    onClick={() => handleAdd(combo.id)}
                    className={`relative inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider shadow-md transition-all duration-300 active:scale-95 cursor-pointer ${
                      isAdded
                        ? "bg-[#2B1B2E] text-white shadow-[0_4px_12px_rgba(43,27,46,0.2)]"
                        : "bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56] text-white shadow-[0_4px_14px_rgba(194,48,107,0.25)] hover:shadow-[0_6px_18px_rgba(194,48,107,0.35)]"
                    }`}
                  >
                    {isAdded && <Check size={14} strokeWidth={3} />}
                    <span>{isAdded ? "Added" : "Add"}</span>
                  </button>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}