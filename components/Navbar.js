"use client";

import Link from "next/link";
import { useRouter,usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import dynamic from "next/dynamic";
import { X, MapPin, CheckCircle2, User,AlertTriangle,Phone } from "lucide-react";
import { FaListUl } from "react-icons/fa";
import BottomNav from "@/components/BottomNav";

// Icons
import { GiHamburgerMenu } from "react-icons/gi";
import {
  IoClose,
  IoHomeSharp,
  IoBagHandleOutline,
} from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { BsShieldCheck } from "react-icons/bs";
import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/router";
const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });
export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const router=useRouter();
  const { user, openLoginModal } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [active, setActive] = useState("Home");
  const [showMap, setShowMap] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [outOfBounds, setOutOfBounds] = useState(false);
// const [active, setActive] = useState(mo);
  const [activeIndex, setActiveIndex] = useState(0);
const [address, setAddress] = useState("Tap To select Address");
const [pendingLocation, setPendingLocation] = useState(null);
// Example: Custom Amritsar delivery boundary
const AMRITSAR_BOUNDS = [
  { lat: 31.709249, lng: 74.817049 }, // North-West
  { lat: 31.666412, lng: 74.959695 }, // North-East
  { lat: 31.569168, lng: 74.891628 }, // South-East
  { lat: 31.626615, lng: 74.756365 }, // South-West
];
const isInsidePolygon = (point, polygon) => {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;

    const intersect =
      yi > point.lng !== yj > point.lng &&
      point.lat <
        ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

  // Update index when active state changes to move the slider
  const handleItemClick = (name, index) => {
    setActive(name);
    setActiveIndex(index);
  };
const checkAmritsar = (lat, lng) => {
  if (!lat || !lng) return false;

  const inside = isInsidePolygon(
    { lat, lng },
    AMRITSAR_BOUNDS
  );

  setOutOfBounds(!inside);
  return inside;
};

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);

      // Always show at very top of page
      if (currentY <= 60) {
        setNavVisible(true);
      } else if (currentY < lastScrollY.current - 4) {
        // Scrolling UP even a little -> float down at top!
        setNavVisible(true);
      } else if (currentY > lastScrollY.current + 8) {
        // Scrolling DOWN -> hide navbar
        setNavVisible(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
useEffect(() => {
  const saved = localStorage.getItem("user_address");
  if (saved) {
    try {
      const { address, lat, lng } = JSON.parse(saved);
      if (address) setAddress(address);
      if (lat && lng) setPendingLocation({ lat, lng });
    } catch (e) {
      console.error("Invalid saved address");
    }
  }
}, []);

  /* ================= CART ================= */
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  const desktopLinks = ["Home", "Clean", "Beauty", "Event Decor", "About"];

  const mobileMenuItems = [
    { name: "Home", href: "/", icon: <IoHomeSharp /> },
    { name: "Beauty", href: "/beauty", icon: <GiHamburgerMenu /> },
    // { name: "buetique", href: "/botique", icon: <IoMdInformationCircleOutline /> },
    { name: "Support", href: "/contact", icon: <FaPhoneAlt /> },
    
  ];
  const sliderItems = [
    { name: "Support", href: "/contact", icon: <GiHamburgerMenu /> },
    { name: "terms & conditions", href: "/t&c", icon: <IoMdInformationCircleOutline /> },
    { name: "Privacy Policy", href: "/privacy", icon: <FaPhoneAlt /> },
      { name: "Cancellation Policy", href: "/refund", icon: <FaPhoneAlt /> },
    // {
    //   name: "Profile",
    //   href: user ? "/user" : "/login",
    //   icon: <CgProfile />,
    // },
  ];

  return (
    <>
   <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start">
              <button onClick={() => setShowMap(false)} className="btn-icon w-12 h-12 shadow-lg">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 w-full h-full relative">
              {/* FIXED: Check your UserMap component's output order. 
                  Standard is usually (address, lat, lng) */}
              <UserMap setAddress={(addr, lat, lng) => {
                setAddress(addr);
                setPendingLocation({ lat, lng });
                // Check instantly so the "Sorry" overlay can appear immediately
                // checkAmritsar(lat, lng);
              }} />

              <AnimatePresence>
  {outOfBounds && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      /* Higher Z-index and saturated backdrop for that premium glass feel */
      className="fixed inset-0 z-[200] bg-[#030712]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
    >
      {/* Animated Icon Container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="relative mb-8"
      >
        {/* Pulsing Outer Ring */}
        <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping scale-150 opacity-20" />
        
        {/* Main Icon Circle */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 rounded-full flex items-center justify-center border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
          <AlertTriangle size={48} className="text-yellow-500" />
        </div>
      </motion.div>

      {/* Text Content with Staggered Slide-up */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">
          Outside Our Zone
        </h2>
        <p className="text-slate-400 text-base max-w-[280px] leading-relaxed font-medium">
          Sparky currently only serves the heart of <span className="text-blue-400 font-extrabold underline decoration-blue-500/30 underline-offset-4">Amritsar</span>. 
        </p>
        <p className="text-slate-500 text-xs mt-2 font-bold tracking-widest uppercase opacity-70">
          More cities coming soon
        </p>
      </motion.div>

      {/* High-Action Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setOutOfBounds(false)}
        className="mt-12 group relative px-12 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl overflow-hidden active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      >
        <span className="relative z-10">Back to City</span>
        {/* Subtle hover glow inside button */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </motion.button>
    </motion.div>
  )}
</AnimatePresence>
            </div>

            <div className="absolute bottom-10 left-0 right-0 p-6 flex justify-center z-10">
              <button
                disabled={!pendingLocation}
                onClick={() => {
  if (!pendingLocation) return;

  const { lat, lng } = pendingLocation;

  if (checkAmritsar(lat, lng)) {
    localStorage.setItem(
      "user_address",
      JSON.stringify({
        address,
        lat,
        lng,
      })
    );

    setShowMap(false);
  }
}}

                className={`px-8 py-3.5 font-bold uppercase tracking-widest text-sm flex items-center gap-3 ${
                  outOfBounds || !pendingLocation
                    ? "bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed rounded-full"
                    : "btn-primary-pill"
                }`}
              >
                <CheckCircle2 size={20} /> Confirm Location
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ================= DESKTOP NAV (Visible on >= 1024px Laptop Screens) ================= */}
      <nav
        style={{
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
        }}
        className={`
          hidden lg:block fixed top-0 left-0 right-0 z-50
          bg-white/95 backdrop-blur-xl border-b border-[#F1DFE8]
          transition-transform duration-300 ease-out
          ${scrolled ? "shadow-[0_12px_32px_rgba(105,43,79,0.08)]" : "shadow-[0_4px_20px_rgba(105,43,79,0.04)]"}
        `}
      >
        <div className="max-w-7xl mx-auto px-8 h-18 flex items-center justify-between gap-6">
          {/* Left: Brand Logo & Location Selector */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-[950] tracking-tight text-[#2B1B2E] italic">
                SPARKY<span className="text-[#C2306B]">.</span>
              </span>
            </Link>

            {/* Location Selector (PRESERVING EXACT MAP CALL) */}
            <button
              onClick={() => setShowMap(true)}
              className="btn-secondary-pill flex items-center gap-2.5 px-4 py-2 text-left"
            >
              <div className="w-6 h-6 rounded-full bg-[#FCEAF1] text-[#C2306B] flex items-center justify-center shadow-xs">
                <MapPin size={13} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D788D]">Current Location</span>
                <span className="text-xs font-black truncate max-w-[180px] text-[#2B1B2E]">{address}</span>
              </div>
            </button>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex items-center gap-1 bg-[#FFF7F3] p-1.5 rounded-full border border-[#F1DFE8]">
            <Link
              href="/"
              className={`px-5 py-2 text-xs font-bold ${
                isActive("/")
                  ? "btn-primary-pill text-white"
                  : "text-[#2B1B2E]/75 hover:text-[#C2306B] hover:bg-white/80 rounded-full transition-all duration-200"
              }`}
            >
              Home
            </Link>
            <Link
              href="/beauty"
              className={`px-5 py-2 text-xs font-bold ${
                isActive("/beauty") || pathname.startsWith("/services")
                  ? "btn-primary-pill text-white"
                  : "text-[#2B1B2E]/75 hover:text-[#C2306B] hover:bg-white/80 rounded-full transition-all duration-200"
              }`}
            >
              Services
            </Link>
            <Link
              href="/bookings"
              className={`px-5 py-2 text-xs font-bold ${
                isActive("/bookings")
                  ? "btn-primary-pill text-white"
                  : "text-[#2B1B2E]/75 hover:text-[#C2306B] hover:bg-white/80 rounded-full transition-all duration-200"
              }`}
            >
              My Bookings
            </Link>
            <Link
              href="/contact"
              className={`px-5 py-2 text-xs font-bold ${
                isActive("/contact") || isActive("/help")
                  ? "btn-primary-pill text-white"
                  : "text-[#2B1B2E]/75 hover:text-[#C2306B] hover:bg-white/80 rounded-full transition-all duration-200"
              }`}
            >
              Help & Support
            </Link>
          </div>

          {/* Right: Cart & Account Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="btn-secondary-pill flex items-center gap-2.5 px-4 py-2 text-[#2B1B2E]"
            >
              <div className="relative">
                <IoBagHandleOutline size={18} className="text-[#2B1B2E]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C2306B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-extrabold text-[#2B1B2E]">Bag</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                if (user) {
                  router.push("/user");
                } else {
                  openLoginModal({
                    redirectTo: "/user",
                  });
                }
              }}
              className="btn-primary-pill flex items-center gap-2 px-5 py-2 text-xs cursor-pointer"
            >
              <User size={14} />
              <span>{user ? (user.name || user.phone || "My Account") : "Login"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed desktop navbar */}
      <div className="hidden lg:block h-18" />

      {/* ================= MOBILE BOTTOM NAV (Hidden on >= 1024px Laptop Screens) ================= */}
      <BottomNav />

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white z-[70] p-8 border-r border-[#F1DFE8] shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 24 }}
            >
              <div className="flex justify-between items-center mb-10">
                <Image src="/images/wLogo.png" alt="Logo" width={120} height={30} />
                <button onClick={() => setMenuOpen(false)}>
                  <IoClose className="text-3xl text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-[#8D788D] text-xs font-bold uppercase tracking-widest">
                  Quick Links
                </p>
                {sliderItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex justify-between items-center text-[#2B1B2E] font-medium hover:text-[#C2306B]"
                  >
                    {item.name}
                    <span className="text-[#8D788D]">→</span>
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-10 left-8 right-8 p-4 bg-[#FCEAF1] rounded-2xl border border-[#F1DFE8]">
                <div className="flex items-center gap-2 text-[#C2306B] mb-2">
                  <BsShieldCheck />
                  <span className="text-xs font-bold">Verified Professionals</span>
                </div>
                <p className="text-[10px] text-[#8D788D]">
                  All partners are background verified.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
function NavItem({ label, icon, active = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        flex-1 flex flex-col items-center justify-center
        cursor-pointer select-none
        active:scale-95 transition-all
      "
    >
      {/* ICON */}
      <div
        className={`
          w-8 h-8 rounded-xl flex items-center justify-center
          transition-all duration-200
          ${
            active
              ? "bg-gradient-to-br from-[#C2306B] to-[#A82058] text-white shadow-[0_6px_14px_rgba(194,48,107,0.25),inset_0_1px_0_rgba(255,255,255,0.25)]"
              : "text-gray-500"
          }
        `}
      >
        {icon}
      </div>

      {/* LABEL */}
      <span
        className={`
          mt-1 text-[10px] leading-none tracking-wide
          ${
            active
              ? "text-[#C2306B] font-semibold"
              : "text-gray-500 font-medium"
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}