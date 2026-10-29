"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  House,
  Wrench,
  ShoppingCart,
  CircleHelp,
  UserRound,
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
        const count = cart.reduce(
          (acc, item) => acc + (item.quantity || 1),
          0
        );
        setCartCount(count);
      } catch {
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
      Icon: House,
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
        path === "/cart" ||
        path === "/bookings" ||
        path.startsWith("/track"),
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
      Icon: UserRound,
      isActive: (path) =>
        path === "/user" ||
        path === "/login" ||
        path === "/register",
    },
  ];

  const activeIndex = navTabs.findIndex((tab) =>
    tab.isActive(pathname)
  );

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 select-none">
      <nav
        aria-label="Mobile navigation"
        className="relative grid grid-cols-5 h-[68px] border-t border-[#EFE8EB] bg-white px-1 pb-[env(safe-area-inset-bottom)]"
      >
        {/* Sliding active indicator */}
        {activeIndex !== -1 && (
          <motion.div
            className="absolute top-0 h-[3px] rounded-full bg-[#C2306B]"
            style={{
              width: `${100 / navTabs.length}%`,
            }}
            initial={false}
            animate={{
              left: `${(activeIndex * 100) / navTabs.length}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 35,
              mass: 0.65,
            }}
          />
        )}

        {navTabs.map((tab) => {
          const active = tab.isActive(pathname);
          const Icon = tab.Icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === "account" && !user) {
                  openLoginModal({ redirectTo: "/user" });
                } else {
                  router.push(tab.href);
                }
              }}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              className="relative flex min-w-0 flex-col items-center justify-center gap-[5px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C2306B]"
            >
              <motion.div
                animate={{
                  y: active ? -1 : 0,
                  scale: active ? 1.04 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 28,
                }}
                className="relative flex items-center justify-center"
              >
                <Icon
                  size={23}
                  strokeWidth={active ? 2.2 : 1.7}
                  className={
                    active ? "text-[#C2306B]" : "text-[#6F6870]"
                  }
                />

                {tab.id === "cart" && cartCount > 0 && (
                  <span className="absolute -right-[9px] -top-[7px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#C2306B] px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </motion.div>

              <motion.span
                animate={{
                  color: active ? "#C2306B" : "#6F6870",
                  fontWeight: active ? 600 : 400,
                }}
                transition={{ duration: 0.18 }}
                className="max-w-full truncate text-[10px] leading-none tracking-[0.01em]"
              >
                {tab.label}
              </motion.span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}