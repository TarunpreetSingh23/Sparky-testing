"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Wrench,
  Calendar,
  CircleHelp,
  ShoppingCart,
  User,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openLoginModal } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("sparky-cart-change", updateCart);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("sparky-cart-change", updateCart);
    };
  }, []);

  const navTabs = [
    {
      id: "home",
      label: "Home",
      href: "/",
      Icon: Home,
      isActive: (path) => path === "/",
    },
    {
      id: "services",
      label: "Services",
      href: "/beauty",
      Icon: Wrench,
      isActive: (path) =>
        path === "/beauty" ||
        path.startsWith("/services") ||
        path === "/clean" ||
        path === "/eventdecor" ||
        path === "/haute",
    },
    {
      id: "cart",
      label: "Cart",
      href: "/cart",
      Icon: ShoppingCart,
      isActive: (path) =>
        path === "/bookings" || path.startsWith("/track"),
    },
    {
      id: "help",
      label: "Help",
      href: "/contact",
      Icon: CircleHelp,
      isActive: (path) =>
        path === "/contact" || path === "/help",
    },
    {
      id: "account",
      label: "Account",
      href: "/user",
      Icon: User,
      isActive: (path) =>
        path === "/user" ||
        path === "/login" ||
        path === "/register",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-20px)] max-w-[440px] z-50 select-none">
      <nav
        aria-label="Mobile navigation"
        className="relative flex h-[66px] items-center justify-between rounded-[32px] border border-white/70 bg-gradient-to-r from-white/95 via-[#FFF7FB]/95 to-[#FFF0F6]/95 px-1.5 shadow-[0_8px_30px_rgba(194,48,107,0.14)] backdrop-blur-2xl"
      >
        {/* Subtle glass reflection */}
        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/50 via-white/10 to-transparent" />

        {navTabs.map((tab) => {
          const active = tab.isActive(pathname);
          const Icon = tab.Icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === "account" && !user) {
                  openLoginModal({
                    redirectTo: "/user",
                  });
                } else {
                  router.push(tab.href);
                }
              }}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              className="group relative z-10 flex h-full flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#C2306B] focus-visible:ring-offset-2"
            >
              {active ? (
                <div className="relative flex h-full w-full flex-col items-center justify-center">
                  {/* Soft arch behind the active icon */}
                  <div className="pointer-events-none absolute -top-[17px] left-1/2 z-10 flex h-[22px] w-[72px] -translate-x-1/2 items-center justify-center">
                    <svg
                      viewBox="0 0 72 22"
                      className="h-full w-full"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 22C12 22 16 2 36 2C56 2 60 22 72 22Z"
                        fill="#FFF7FB"
                      />
                      <path
                        d="M0 22C12 22 16 2 36 2C56 2 60 22 72 22"
                        stroke="#F1DFE8"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </div>

                  {/* Active rose glass button */}
                  <motion.div
                    layoutId="activeTabCircle"
                    initial={{ scale: 0.85, y: 6 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 28,
                    }}
                    className="absolute -top-[25px] z-20 flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-gradient-to-br from-[#E98CB0] via-[#C2306B] to-[#A51F56] text-white shadow-[0_8px_20px_rgba(194,48,107,0.28)]"
                  >
                    {/* Glass highlight */}
                    <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-white/5 to-transparent" />

                    <Icon
                      size={24}
                      strokeWidth={2.2}
                      className="relative z-10 text-white drop-shadow-sm"
                    />
                  </motion.div>

                  {/* Floating Cart Badge */}
                  {tab.id === "cart" && cartCount > 0 && (
                    <span className="absolute -top-[28px] -right-1 z-30 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#2B1B2E] px-1 text-[9px] font-black text-white shadow-md ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}

                  {/* Active label */}
                  <span className="relative z-20 mt-6 text-[11px] font-bold tracking-tight text-[#C2306B]">
                    {tab.label}
                  </span>
                </div>
              ) : (
                <motion.div
                  whileTap={{ scale: 0.94 }}
                  className="relative flex h-full w-full flex-col items-center justify-center rounded-2xl transition-colors duration-300 group-hover:bg-[#C2306B]/[0.06]"
                >
                  <div className="relative">
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                      className="text-[#2B1B2E]/75 transition-colors duration-300 group-hover:text-[#C2306B]"
                    />

                    {/* Floating Cart Badge */}
                    {tab.id === "cart" && cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 z-20 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56] px-1 text-[9px] font-black text-white shadow-md ring-2 ring-white">
                        {cartCount}
                      </span>
                    )}
                  </div>

                  <span className="mt-1 text-[11px] font-medium leading-tight text-[#2B1B2E]/75 transition-colors duration-300 group-hover:text-[#C2306B]">
                    {tab.label}
                  </span>
                </motion.div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}