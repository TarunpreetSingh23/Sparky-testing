"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  CircleHelp,
  User,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openLoginModal } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Sync cart count with storage and custom sparky-cart-change events
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
      Icon: LayoutGrid,
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
        path === "/cart" || path === "/bookings" || path.startsWith("/track"),
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 select-none">
      <nav
        aria-label="Mobile Bottom Navigation"
        className="relative flex h-[60px] items-center justify-around border-t border-[#EAE7E9] bg-white/98 px-2 backdrop-blur-md shadow-[0_-2px_12px_rgba(37,35,42,0.06)]"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 4px)",
        }}
      >
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
              className="relative flex flex-1 h-full flex-col items-center justify-center focus:outline-none cursor-pointer py-1"
            >
              {/* Subtle top indicator bar for active state */}
              {active && (
                <motion.div
                  layoutId="activeBottomTabLine"
                  className="absolute top-0 h-[2.5px] w-8 rounded-full bg-[#C2306B]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  strokeWidth={active ? 2.3 : 1.8}
                  className={`transition-colors duration-200 ${
                    active ? "text-[#C2306B]" : "text-[#77717A]"
                  }`}
                />

                {/* Cart Quantity Badge */}
                {tab.id === "cart" && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#C2306B] px-1 text-[9px] font-black text-white shadow-xs">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>

              {/* Tab Label */}
              <span
                className={`mt-1 text-[10px] tracking-tight font-medium leading-none transition-colors duration-200 ${
                  active ? "font-bold text-[#C2306B]" : "text-[#77717A]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}