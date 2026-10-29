"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import FloatingOrderTracker from "@/components/FloatingOrderTracker";
import AboutSections from "@/components/AboutSections";
import BeautyBannerCarousel from "@/components/BeautyBannerCarosl";
import ValueComboPackages from "@/components/Combos";
import MobileFestivalHero from "@/components/MobileFestivalHero";
import MobileCategoryStrip from "@/components/MobileCategoryStrip";
import MobilePromoCards from "@/components/MobilePromoCards";

import {
  Search,
  Sparkles,
  Wrench,
  X,
  MapPin,
  Star,
  ArrowRight,
  Scissors,
  User,
  AlertTriangle,
  Palette,
  Wind,
  CheckCircle2,
  Waves,
  Zap,
  Smile,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  PhoneCall,
  SlidersHorizontal,
  Plus,
  Clock,
} from "lucide-react";

const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });

/* ================= STATIC DESKTOP CATEGORIES ================= */
const want = [
  { id: 1, name: "Pedicure", icon: Scissors, image: "/images/CATEGORY-ICONS/pedicure.png" },
  { id: 2, name: "Manicure", icon: Zap, image: "/images/CATEGORY-ICONS/manicure.png" },
  { id: 3, name: "Facial", icon: Sparkles, image: "/images/CATEGORY-ICONS/facial.png" },
  { id: 4, name: "Bleach", icon: Palette, image: "/images/CATEGORY-ICONS/bleach.png" },
  { id: 5, name: "Cleanup", icon: Waves, image: "/images/CATEGORY-ICONS/cleanup.png" },
  { id: 6, name: "Waxing", icon: Wind, image: "/images/CATEGORY-ICONS/waxing.png" },
  { id: 7, name: "Makeup", icon: Smile, image: "/images/CATEGORY-ICONS/makeup.png" },
  { id: 8, name: "Hair", icon: MessageCircle, image: "/images/CATEGORY-ICONS/hair.png" },
];

export default function SparkyServiceApp() {
  const router = useRouter();
  const { user, openLoginModal } = useAuth();

  const searchRef = useRef(null);
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [address, setAddress] = useState("Amritsar, Punjab");

  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [minCartError, setMinCartError] = useState("");
  const [mobileCategoryFilter, setMobileCategoryFilter] = useState("all");

  // Amritsar Delivery Boundary Definition
  const AMRITSAR_BOUNDS = [
    { lat: 31.709249, lng: 74.817049 }, // North-West
    { lat: 31.666412, lng: 74.959695 }, // North-East
    { lat: 31.569168, lng: 74.891628 }, // South-East
    { lat: 31.626615, lng: 74.756365 }, // South-West
  ];

  const isInsidePolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat,
        yi = polygon[i].lng;
      const xj = polygon[j].lat,
        yj = polygon[j].lng;
      const intersect =
        yi > point.lng !== yj > point.lng &&
        point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const checkAmritsar = (lat, lng) => {
    if (!lat || !lng) return false;
    const inside = isInsidePolygon({ lat, lng }, AMRITSAR_BOUNDS);
    setOutOfBounds(!inside);
    return inside;
  };

  // Active pending/ongoing order for FloatingOrderTracker
  const activeOrder = orders.find(
    (order) => order.status !== "cancelled" && order.status !== "completed"
  );

  // Fetch Services from Database API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch User Orders for Floating Tracker
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/by-phone");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Load saved address from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("user_address_text");
    if (saved) {
      setAddress(saved);
    } else {
      const savedObj = localStorage.getItem("user_address");
      if (savedObj) {
        try {
          const parsed = JSON.parse(savedObj);
          if (parsed.address) setAddress(parsed.address);
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  // Real-time Search Logic connecting to DB services
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const safeServices = Array.isArray(services) ? services : [];
    const filtered = safeServices.filter((s) => {
      const title = (s.name || s.title || "").toLowerCase();
      const cat = (s.category || "").toLowerCase();
      const term = query.toLowerCase();
      return title.includes(term) || cat.includes(term);
    });
    setResults(filtered.slice(0, 6));
    setOpen(true);
  }, [query, services]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getCartTotal = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  };

  const MIN_CART_VALUE = 299;

  const handleBooking = (service) => {
    const itemToAdd = {
      title: service.name || service.title,
      price:
        typeof service.price === "string"
          ? parseInt(service.price.replace(/[₹,\s]/g, ""), 10)
          : service.price,
      image: service.image || service.imageUrl || "/images/goldfacial.webp",
      quantity: 1,
      category: service.category || "Woman Services",
      earning: service.earning || 0,
      profit: service.profit || 0,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = existingCart.findIndex(
      (item) => item.title === itemToAdd.title
    );

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity = (existingCart[existingIndex].quantity || 1) + 1;
    } else {
      existingCart.push(itemToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("sparky-cart-change"));

    const total = getCartTotal();
    if (total < MIN_CART_VALUE) {
      const remaining = MIN_CART_VALUE - total;
      setMinCartError(`Add ₹${remaining} more service`);
      return;
    }

    setMinCartError("");
    router.push("/cart");
  };

  // Scroll to section when desktop category is clicked
  const handleDesktopCategoryClick = (categoryName) => {
    const elements = document.querySelectorAll("h3, h2");
    for (const el of elements) {
      if (el.textContent.toLowerCase().includes(categoryName.toLowerCase())) {
        const offset = 100;
        const pos = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: pos - offset, behavior: "smooth" });
        break;
      }
    }
  };

  if (servicesLoading && services.length === 0) {
    return <SparkyMobileSkeleton />;
  }

  // Mobile service categories to display
  const mobileDisplayCategories = [
    { key: "Facial", label: "Facials & Cleanups" },
    { key: "Waxing", label: "Smooth Waxing Rituals" },
    { key: "Hair", label: "Hair Spa & Styling" },
    { key: "Manicure", label: "Manicure & Pedicure" },
    { key: "Makeup", label: "Party & Bridal Makeup" },
    { key: "Bleach", label: "Glow Bleach Treatments" },
  ];

  const activeMobileCategories =
    mobileCategoryFilter === "all"
      ? mobileDisplayCategories
      : mobileDisplayCategories.filter((c) =>
          c.key.toLowerCase().includes(mobileCategoryFilter.toLowerCase())
        );

  return (
    <div className="min-h-screen w-full bg-[#F7F7F5] lg:bg-gradient-to-b lg:from-[#FFF8F6] lg:via-[#FFF1F5] lg:to-[#FFF7FB] text-[#25232A]">
      {/* ================= USER MAP MODAL ================= */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start">
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="btn-icon w-11 h-11 shadow-lg bg-white rounded-full flex items-center justify-center"
              >
                <X size={20} className="text-[#25232A]" />
              </button>
            </div>

            <div className="flex-1 w-full h-full relative">
              <UserMap
                setAddress={(addr, lat, lng) => {
                  setAddress(addr);
                  setPendingLocation({ lat, lng });
                }}
              />

              <AnimatePresence>
                {outOfBounds && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-[#25232A]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="relative mb-6">
                      <div className="relative w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/40">
                        <AlertTriangle size={36} className="text-amber-400" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                      Outside Our Service Zone
                    </h2>
                    <p className="text-slate-300 text-sm max-w-[280px]">
                      Sparky currently delivers expert home services across{" "}
                      <span className="text-[#C2306B] font-extrabold underline">
                        Amritsar
                      </span>
                      .
                    </p>
                    <button
                      type="button"
                      onClick={() => setOutOfBounds(false)}
                      className="mt-8 px-8 py-3 bg-white text-[#25232A] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg"
                    >
                      Back to City
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute bottom-8 left-0 right-0 p-5 flex justify-center z-10">
              <button
                type="button"
                disabled={!pendingLocation}
                onClick={() => {
                  if (!pendingLocation) return;
                  const { lat, lng } = pendingLocation;
                  if (checkAmritsar(lat, lng)) {
                    localStorage.setItem(
                      "user_address",
                      JSON.stringify({ address, lat, lng })
                    );
                    localStorage.setItem("user_address_text", address);
                    setShowMap(false);
                  }
                }}
                className={`px-8 py-3.5 font-bold uppercase tracking-wider text-xs flex items-center gap-2 rounded-full shadow-lg ${
                  outOfBounds || !pendingLocation
                    ? "bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed"
                    : "btn-primary-pill bg-[#C2306B] text-white"
                }`}
              >
                <CheckCircle2 size={18} /> Confirm Location
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 4. MOBILE HEADER (Inspired by Blinkit Location-First Layout) ================= */}
      <header className="lg:hidden sticky top-0 left-0 right-0 z-40 bg-white border-b border-[#EAE7E9] px-3.5 pt-2.5 pb-2.5 shadow-[0_2px_10px_rgba(37,35,42,0.04)]">
        {/* Top Row: Brand & Delivery Promise + Location Selector + Account Shortcut */}
        <div className="flex items-center justify-between mb-2.5">
          {/* Left: Brand + Location */}
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-[950] tracking-tight italic text-[#25232A]">
                SPARKY<span className="text-[#C2306B]">.</span>
              </span>
              <span className="text-[10px] font-semibold text-[#77717A] tracking-tight truncate">
                • Expert doorstep services
              </span>
            </div>

            {/* Location Selector Pill */}
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="inline-flex items-center gap-1 text-left mt-0.5 focus:outline-none cursor-pointer group active:opacity-80"
            >
              <MapPin size={13} className="text-[#C2306B] shrink-0" />
              <span className="text-[12px] font-black text-[#25232A] truncate max-w-[210px] tracking-tight">
                {address}
              </span>
              <ChevronDown size={13} className="text-[#77717A] shrink-0" />
            </button>
          </div>

          {/* Right: Account or Login Shortcut */}
          <button
            type="button"
            onClick={() => {
              if (user) {
                router.push("/user");
              } else {
                openLoginModal({ redirectTo: "/user" });
              }
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7F7F5] border border-[#EAE7E9] text-[#25232A] shadow-xs active:scale-95 transition-transform"
            aria-label="User Account"
          >
            <User size={16} className="text-[#25232A]" />
          </button>
        </div>

        {/* Bottom Row: Search Bar + Filter Icon */}
        <div className="flex items-center gap-2">
          <div ref={searchRef} className="relative flex-1">
            <div className="flex h-[42px] items-center rounded-xl bg-[#F7F7F5] border border-[#EAE7E9] px-3 transition-colors focus-within:bg-white focus-within:border-[#C2306B]/50 focus-within:shadow-xs">
              <Search size={16} className="text-[#77717A] mr-2 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cleaning, beauty, facial, AC..."
                className="flex-1 bg-transparent text-[13px] font-medium text-[#25232A] outline-none placeholder:text-[#77717A]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-[#77717A] hover:text-[#25232A]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {open && results.length > 0 && (
              <div className="absolute top-full mt-1.5 left-0 right-0 z-50 rounded-2xl bg-white border border-[#EAE7E9] shadow-xl overflow-hidden divide-y divide-[#EAE7E9]">
                {results.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setQuery("");
                      setOpen(false);
                      setSelectedService(item);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-[#F7F7F5] cursor-pointer transition-colors"
                  >
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-[#F7F7F5] shrink-0 border border-[#EAE7E9]">
                      <Image
                        src={item.image || "/images/goldfacial.webp"}
                        alt={item.name || item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-[#25232A] truncate">
                        {item.name || item.title}
                      </p>
                      <p className="text-[10px] text-[#77717A] truncate">
                        {item.category || "Woman Services"}
                      </p>
                    </div>
                    <span className="text-[12px] font-black text-[#C2306B]">
                      ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Filter button leading to beauty category view */}
          <button
            type="button"
            onClick={() => router.push("/beauty")}
            aria-label="Filter Services"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#F7F7F5] border border-[#EAE7E9] text-[#25232A] shadow-xs active:scale-95 transition-transform"
          >
            <SlidersHorizontal size={16} className="text-[#25232A]" />
          </button>
        </div>
      </header>

      {/* ================= 5. HORIZONTAL CATEGORY NAVIGATION (Mobile Only) ================= */}
      <MobileCategoryStrip
        activeCategory={mobileCategoryFilter}
        onSelectCategory={(catId) => setMobileCategoryFilter(catId)}
      />

      {/* ================= 6. MOBILE FESTIVAL HERO SECTION (Configurable, Mobile Only) ================= */}
      <MobileFestivalHero />

      {/* ================= 7. PROMOTIONAL SERVICE CARDS (Mobile Only) ================= */}
      <MobilePromoCards />

      {/* ================= DESKTOP HERO SECTION (PRESERVED 100% FOR DESKTOP / LAPTOPS) ================= */}
      <section className="hidden lg:block relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-white via-white/80 to-[#FFF7F3]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C2306B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#8E4FD6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCEAF1] border border-[#F1DFE8] shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#C2306B] animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C2306B]">
                About Sparky • The Home Service Revolution
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2B1B2E] tracking-tight leading-[1.12]"
            >
              Salon Luxury & Master Repairs,{" "}
              <span className="bg-gradient-to-r from-[#C2306B] via-[#A83DAA] to-[#8E4FD6] bg-clip-text text-transparent">
                Delivered to Your Door.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-[#8D788D] font-medium leading-relaxed max-w-2xl mx-auto pt-2"
            >
              Sparky was built on a simple promise: make professional home and
              beauty services effortless, safe, and transparent. No endless phone
              calls, no bargaining, and no compromises on hygiene.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-4"
            >
              <Link
                href="/beauty"
                className="btn-primary-pill px-6 py-3.5 text-xs uppercase tracking-wider flex items-center gap-2 bg-[#C2306B] text-white rounded-full"
              >
                <span>Explore Services</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="btn-secondary-pill px-6 py-3.5 text-xs uppercase tracking-wider flex items-center gap-2 bg-white text-[#C2306B] border border-[#F1DFE8] rounded-full"
              >
                <PhoneCall size={15} className="text-[#C2306B]" />
                <span>Contact Us</span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 max-w-4xl mx-auto"
          >
            {[
              { value: "15,000+", label: "Bookings Fulfilled", icon: CheckCircle2 },
              { value: "4.9 / 5", label: "Customer Satisfaction", icon: Star },
              { value: "100%", label: "Background Verified", icon: ShieldCheck },
              { value: "< 30 Min", label: "Rapid Booking Match", icon: Zap },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#F1DFE8] shadow-[0_8px_25px_rgba(105,43,79,0.04)] text-center flex flex-col items-center justify-center hover:shadow-md transition-shadow"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FCEAF1] text-[#C2306B] flex items-center justify-center mb-2">
                    <Icon size={18} />
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-[#2B1B2E] tracking-tight">
                    {s.value}
                  </span>
                  <span className="text-[11px] font-bold text-[#8D788D] uppercase tracking-wider mt-0.5">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= DESKTOP CATEGORY ICONS STRIP (PRESERVED FOR LAPTOPS) ================= */}
      <section className="hidden lg:block mt-2 px-4">
        <div className="max-w-7xl mx-auto p-6 rounded-[24px] bg-white border border-[#F1DFE8] shadow-[0_4px_18px_rgba(105,43,79,0.07)]">
          <div className="grid grid-cols-8 gap-4">
            {want.map((cat, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleDesktopCategoryClick(cat.name)}
                className="group flex flex-col items-center gap-2 p-1.5 rounded-2xl transition-all cursor-pointer"
              >
                <div className="relative w-full aspect-[4/5] max-w-[84px] rounded-t-[45px] rounded-b-[16px] overflow-hidden border border-[#F1DFE8] bg-gradient-to-b from-white via-[#FFF5F8] to-[#F8E2EC] shadow-xs group-hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute inset-2 overflow-hidden rounded-t-[38px] rounded-b-[12px]">
                    <Image
                      src={cat.image}
                      fill
                      sizes="84px"
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-300 p-0.5"
                      alt={cat.name}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-center text-[#2B1B2E] group-hover:text-[#C2306B] transition-colors tracking-tight">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DESKTOP BEAUTY BANNER CAROUSEL ================= */}
      <div className="hidden lg:block">
        <BeautyBannerCarousel />
      </div>

      {/* ================= 8. MAIN SERVICE DISCOVERY (Clean Mobile Market Sections) ================= */}
      <main className="px-3.5 sm:px-4 lg:px-6 space-y-6 pt-3 pb-24 lg:pb-16 max-w-7xl mx-auto">
        {/* Active Order Floating Tracker */}
        {activeOrder && (
          <div className="block lg:hidden">
            <FloatingOrderTracker activeOrder={activeOrder} />
          </div>
        )}

        {/* MOBILE CATEGORY SECTIONS (Blinkit marketplace clean cards) */}
        <div className="block lg:hidden space-y-6">
          {activeMobileCategories.map((subCat) => {
            const safeServices = Array.isArray(services) && services.length > 0 ? services : [
              { id: "fb-1", name: `${subCat.key} Ritual Care`, title: `${subCat.key} Ritual Care`, price: 799, image: "/images/goldfacial.webp", category: "Woman Services", rating: 4.9 },
              { id: "fb-2", name: `Express ${subCat.key}`, title: `Express ${subCat.key}`, price: 499, image: "/images/deepcleanup.webp", category: "Woman Services", rating: 4.8 },
            ];

            const filteredServices = safeServices.filter(
              (item) =>
                (item.category === "Woman Services" || !item.category) &&
                (item.name || item.title || "")
                  .toLowerCase()
                  .includes(subCat.key.toLowerCase())
            );

            const displayServices = (filteredServices.length > 0 ? filteredServices : safeServices).slice(0, 4);

            return (
              <section key={subCat.key} className="space-y-3">
                {/* Section Header */}
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-1 rounded-full bg-[#C2306B]" />
                    <h3 className="text-[15px] font-extrabold tracking-tight text-[#25232A]">
                      {subCat.label}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/beauty?category=${encodeURIComponent(subCat.key.toUpperCase())}`
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C2306B] hover:underline"
                  >
                    <span>View all</span>
                    <ChevronRight size={13} strokeWidth={2.5} />
                  </button>
                </div>

                {/* 2-Column Responsive Service Grid for Mobile */}
                <div className="grid grid-cols-2 gap-2.5">
                  {displayServices.map((item) => {
                    const image =
                      item.image || item.imageUrl || item.thumbnail || "/images/goldfacial.webp";
                    const title = item.name || item.title;
                    const price =
                      Number(String(item.price ?? 0).replace(/[₹,\s]/g, "")) || 0;
                    const originalPrice = Math.round(price * 1.25);

                    return (
                      <div
                        key={item._id || item.id || title}
                        onClick={() => setSelectedService(item)}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#EAE7E9] bg-white p-2.5 shadow-[0_2px_8px_rgba(37,35,42,0.04)] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        {/* Service Image with Rating Tag */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-[#F7F7F5]">
                          <Image
                            src={image}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 160px, 200px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Rating Badge */}
                          <div className="absolute top-2 left-2 flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-extrabold text-[#25232A] shadow-xs border border-[#EAE7E9]">
                            <Star size={10} fill="#f59e0b" className="text-amber-500" />
                            <span>{item.rating || "4.8"}</span>
                          </div>

                          {/* Quick Add Button */}
                          <button
                            type="button"
                            aria-label={`Add ${title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBooking(item);
                            }}
                            className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#C2306B] text-white shadow-md active:scale-90 transition-transform cursor-pointer"
                          >
                            <Plus size={16} strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* Service Title */}
                        <div className="mt-2.5 flex-1">
                          <h4 className="text-[12px] font-bold leading-[1.35] text-[#25232A] line-clamp-2">
                            {title}
                          </h4>
                        </div>

                        {/* Price Row */}
                        <div className="mt-2 flex items-baseline justify-between border-t border-[#F7F7F5] pt-1.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[13px] font-black text-[#25232A]">
                              ₹{price}
                            </span>
                            <span className="text-[10px] font-medium text-[#77717A] line-through">
                              ₹{originalPrice}
                            </span>
                          </div>
                          <span className="text-[9px] font-extrabold text-[#C2306B] uppercase tracking-wider">
                            Verified
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* VALUE COMBO PACKAGES (Shared for Mobile & Desktop) */}
        <section aria-label="Combo Packages" className="pt-2">
          <ValueComboPackages />
        </section>

        {/* DESKTOP-ONLY ABOUT SECTIONS */}
        <div className="hidden lg:block pt-6">
          <AboutSections />
        </div>
      </main>

      {/* ================= MINIMUM CART ERROR BAR ================= */}
      {minCartError && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm rounded-2xl bg-white/95 border border-[#EAE7E9] p-3 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F6] text-[#C2306B] font-black text-sm border border-[#F1DFE8]">
              ₹
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#25232A] leading-tight">
                {minCartError}
              </p>
              <p className="text-[10px] text-[#77717A]">
                Minimum booking order value is ₹{MIN_CART_VALUE}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/beauty")}
              className="rounded-lg bg-[#C2306B] px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-xs"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* ================= SERVICE DETAIL DRAWER / MODAL ================= */}
      {/* Backdrop */}
      <div
        onClick={() => setSelectedService(null)}
        className={`fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          selectedService ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* Drawer Container */}
      <div
        className={`fixed z-[70] overflow-hidden bg-white border border-[#EAE7E9] transition-all duration-300 ease-out
          /* Mobile: Slide-up Bottom Sheet */
          bottom-0 left-0 right-0 w-full rounded-t-[28px] shadow-[0_-12px_36px_rgba(37,35,42,0.18)]
          /* Laptop: Centered Modal Dialog */
          lg:top-1/2 lg:bottom-auto lg:left-1/2 lg:-translate-x-1/2 lg:max-w-md lg:rounded-[28px] lg:shadow-2xl
          ${
            selectedService
              ? "translate-y-0 lg:-translate-y-1/2 opacity-100 visible"
              : "translate-y-full lg:opacity-0 lg:invisible pointer-events-none"
          }`}
      >
        {/* Mobile Pull Handle */}
        <div className="mx-auto mt-2.5 mb-1 h-1 w-10 rounded-full bg-[#EAE7E9] lg:hidden" />

        {selectedService && (
          <div className="p-5 pt-2">
            {/* Image Banner */}
            <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-[#F7F7F5] mb-4 border border-[#EAE7E9]">
              <Image
                src={selectedService.image || "/images/goldfacial.webp"}
                alt={selectedService.name || selectedService.title}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#25232A] shadow-md border border-[#EAE7E9]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Title & Price */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-lg font-black text-[#25232A] tracking-tight">
                  {selectedService.name || selectedService.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={13} fill="currentColor" />
                    <span className="text-xs font-bold text-[#25232A]">
                      {selectedService.rating || "4.9"}
                    </span>
                  </div>
                  <span className="text-[#77717A]">•</span>
                  <span className="text-[10px] font-bold text-[#C2306B] uppercase tracking-wider">
                    Verified Professional
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xl font-black text-[#25232A]">
                  ₹{selectedService.price}
                </span>
                <p className="text-[9px] uppercase tracking-widest text-[#77717A]">
                  Inclusive of all taxes
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs font-normal leading-relaxed text-[#77717A] mb-5">
              {selectedService.description ||
                "Enjoy premium salon & home services by verified, trained professionals using sanitized tools and single-use hygienic kits."}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  handleBooking(selectedService);
                  setSelectedService(null);
                }}
                className="flex-1 py-3 rounded-xl bg-[#C2306B] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <span>Book Service</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push(
                    `/services/${encodeURIComponent(
                      selectedService.title || selectedService.name
                    )}`
                  );
                }}
                className="px-4 py-3 rounded-xl border border-[#EAE7E9] bg-white text-xs font-black uppercase tracking-wider text-[#25232A] shadow-xs active:scale-95 transition-transform cursor-pointer"
              >
                Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SKELETON LOADER ================= */
function SparkyMobileSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] p-4 space-y-4">
      {/* Header skeleton */}
      <div className="h-20 w-full rounded-2xl bg-white animate-pulse border border-[#EAE7E9]" />
      {/* Category strip skeleton */}
      <div className="h-16 w-full rounded-2xl bg-white animate-pulse border border-[#EAE7E9]" />
      {/* Hero skeleton */}
      <div className="h-40 w-full rounded-2xl bg-white animate-pulse border border-[#EAE7E9]" />
      {/* Cards skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-48 rounded-2xl bg-white animate-pulse border border-[#EAE7E9]" />
        <div className="h-48 rounded-2xl bg-white animate-pulse border border-[#EAE7E9]" />
      </div>
    </div>
  );
}