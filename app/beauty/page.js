"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import {
  X,
  ShoppingCart,
  Trash2,
  Star,
  ChevronRight,
  ChevronLeft,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Filter,
  ArrowRight,
  Plus,
  Minus,
  Search,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// =========================================================================
// AUTHENTIC BRAND COLOR SYSTEM (Sparky Pink with Complementary Tones)
// =========================================================================
const COLORS = {
  primary: "#C2306B",     // Primary brand pink
  primaryDark: "#A82058", // Darker rose for active/hover
  blush: "#FCF1F5",       // Light blush background
  roseSoft: "#F9E3EC",    // Soft rose background
  teal: "#094B66",        // Deep teal
  blueLight: "#EEF5F7",   // Light blue
  cream: "#F7F0EB",       // Warm cream
  sage: "#F4F3EA",        // Soft sage
  sageAccent: "#C0BC91",  // Sage accent
  brownDeep: "#55210A",   // Deep warm brown
  text: "#25232A",        // Main dark text
  muted: "#77717A",       // Secondary text
  border: "#EAE7E9",      // Border gray
  surface: "#FFFFFF",     // White surface
  bg: "#FFFCFD",          // Subtle page background
};

// =========================================================================
// CATEGORY DEFINITIONS WITH AUTHENTIC LOCAL ASSETS
// =========================================================================
const CATEGORIES = [
  { id: "ALL", name: "All", icon: "/images/sremovebg.png" },
  { id: "FACIAL", name: "Facials", icon: "/images/CATEGORY-ICONS/facial.png" },
  { id: "CLEANUP", name: "Cleanup", icon: "/images/CATEGORY-ICONS/cleanup.png" },
  { id: "WAXING", name: "Waxing", icon: "/images/CATEGORY-ICONS/waxing.png" },
  { id: "MAKEUP", name: "Makeup", icon: "/images/CATEGORY-ICONS/makeup.png" },
  { id: "HAIR", name: "Hair", icon: "/images/CATEGORY-ICONS/hair.png" },
  { id: "MANICURE", name: "Manicure", icon: "/images/CATEGORY-ICONS/manicure.png" },
  { id: "PEDICURE", name: "Pedicure", icon: "/images/CATEGORY-ICONS/pedicure.png" },
  { id: "BLEACH", name: "Bleach", icon: "/images/CATEGORY-ICONS/bleach.png" },
  { id: "THREADING", name: "Threading", icon: "/images/eyebrowthreading.webp" },
];

// Fallback initial services to ensure instant rendering with zero blank screen
const INITIAL_BEAUTY_SERVICES = [
  {
    _id: "b1",
    serviceId: "WU01_GOLD_FACIAL",
    title: "Gold Radiant Facial",
    name: "Gold Radiant Facial",
    category: "Woman Services",
    price: 999,
    rating: 4.9,
    image: "/images/goldfacial.webp",
    description: "Multi-step gold glow facial that exfoliates, hydrates, and restores radiant youthful skin.",
  },
  {
    _id: "b2",
    serviceId: "WU02_DIAMOND_BLEACH",
    title: "Diamond Glow Bleach",
    name: "Diamond Glow Bleach",
    category: "Woman Services",
    price: 399,
    rating: 4.8,
    image: "/images/diamondfacial.webp",
    description: "Even-toned brightness for face and neck with soothing pre and post-bleach protection creams.",
  },
  {
    _id: "b3",
    serviceId: "WU03_FULL_WAX",
    title: "Full Arms & Legs Waxing",
    name: "Full Arms & Legs Waxing",
    category: "Woman Services",
    price: 799,
    rating: 4.9,
    image: "/images/fullarmwaxing.webp",
    description: "Painless chocolate roll-on waxing for smooth, hair-free skin with soothing post-wax aloe lotion.",
  },
  {
    _id: "b4",
    serviceId: "WU04_CLASSIC_PEDI",
    title: "Classic Pedicure",
    name: "Classic Pedicure",
    category: "Woman Services",
    price: 599,
    rating: 4.8,
    image: "/images/classicpedicure.webp",
    description: "Relaxing foot soak, cuticle grooming, heel scrubbing, and tension-relief foot massage.",
  },
  {
    _id: "b5",
    serviceId: "WU05_HAIR_SPA",
    title: "Hair Spa & Scalp Therapy",
    name: "Hair Spa & Scalp Therapy",
    category: "Woman Services",
    price: 899,
    rating: 4.9,
    image: "/images/curlsandwaves.webp",
    description: "Intense root nourishment, deep conditioning cream bath, steam, and therapeutic scalp massage.",
  },
  {
    _id: "b6",
    serviceId: "WU06_BRIDAL_MAKEUP",
    title: "Party & Event Makeup",
    name: "Party & Event Makeup",
    category: "Woman Services",
    price: 1999,
    rating: 5.0,
    image: "/images/bridalmakeup.webp",
    description: "Long-lasting HD makeup with customized contour, eye glam, and setting spray by verified MUAs.",
  },
  {
    _id: "b7",
    serviceId: "WU07_CLEANUP",
    title: "Deep Pore Cleansing Cleanup",
    name: "Deep Pore Cleansing Cleanup",
    category: "Woman Services",
    price: 699,
    rating: 4.8,
    image: "/images/deepcleanup.webp",
    description: "Targeted blackhead removal, steam, fruit scrub exfoliation, and pore-tightening pack.",
  },
  {
    _id: "b8",
    serviceId: "WU08_THREADING",
    title: "Eyebrow & Upper Lip Threading",
    name: "Eyebrow & Upper Lip Threading",
    category: "Woman Services",
    price: 149,
    rating: 4.9,
    image: "/images/eyebrowthreading.webp",
    description: "Precision organic cotton threading for clean eyebrow arch shaping and gentle upper lip hair removal.",
  },
];

export default function BeautyServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category")?.toUpperCase() || "ALL";

  // Data State
  const [services, setServices] = useState(INITIAL_BEAUTY_SERVICES);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [minCartError, setMinCartError] = useState("");
  const [userAddress, setUserAddress] = useState("Amritsar, Punjab");

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended"); // recommended | price_asc | price_desc | rating_desc
  const [priceFilter, setPriceFilter] = useState("all"); // all | under500 | under1000 | above1000
  const [ratingFilter, setRatingFilter] = useState("all"); // all | 4.8 | 4.5

  const MIN_CART_VALUE = 299;

  // Sync category with URL
  useEffect(() => {
    const cat = searchParams.get("category")?.toUpperCase();
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Load user address from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_address_text");
      if (saved) {
        setUserAddress(saved);
      } else {
        const savedObj = localStorage.getItem("user_address");
        if (savedObj) {
          try {
            const parsed = JSON.parse(savedObj);
            if (parsed.address) setUserAddress(parsed.address);
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }, []);

  // Fetch Services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/facial");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setServices(data);
          }
        }
      } catch (error) {
        console.error("Error loading beauty services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();

    // Sync Cart from LocalStorage
    const syncCart = () => {
      try {
        const saved = localStorage.getItem("cart");
        if (saved) setCart(JSON.parse(saved));
      } catch (e) {
        setCart([]);
      }
    };
    syncCart();

    window.addEventListener("storage", syncCart);
    window.addEventListener("sparky-cart-change", syncCart);
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("sparky-cart-change", syncCart);
    };
  }, []);

  // Cart Calculations
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cart]);

  // Item quantity helper
  const getItemQuantity = (serviceTitle) => {
    const item = cart.find(
      (i) => i.title?.toLowerCase() === serviceTitle?.toLowerCase()
    );
    return item ? item.quantity || 1 : 0;
  };

  // Cart update handler
  const handleUpdateQuantity = (service, delta) => {
    const title = service.name || service.title;
    const priceNum =
      typeof service.price === "string"
        ? parseInt(service.price.replace(/[₹,\s]/g, ""), 10)
        : service.price;

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = existingCart.findIndex(
      (i) => i.title?.toLowerCase() === title?.toLowerCase()
    );

    let updatedCart = [...existingCart];

    if (existingIndex > -1) {
      const currentQty = existingCart[existingIndex].quantity || 1;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        updatedCart.splice(existingIndex, 1);
      } else {
        updatedCart[existingIndex].quantity = newQty;
      }
    } else if (delta > 0) {
      updatedCart.push({
        title,
        name: title,
        price: priceNum,
        image: service.image || "/images/goldfacial.webp",
        quantity: 1,
        category: service.category || "Woman Services",
        earning: service.earning || 0,
        profit: service.profit || 0,
      });
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("sparky-cart-change"));

    const newTotal = updatedCart.reduce(
      (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
      0
    );

    if (newTotal > 0 && newTotal < MIN_CART_VALUE) {
      setMinCartError(`Add at least ₹${MIN_CART_VALUE - newTotal} more service`);
    } else {
      setMinCartError("");
    }
  };

  // Filter & Sort Logic
  const filteredServices = useMemo(() => {
    let result = [...services];

    // 1. Category Filter
    if (selectedCategory !== "ALL") {
      result = result.filter((s) => {
        const title = (s.title || s.name || "").toLowerCase();
        const cat = (s.category || "").toLowerCase();
        const target = selectedCategory.toLowerCase();
        return title.includes(target) || cat.includes(target);
      });
    }

    // 2. Search Query Filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => {
        const title = (s.title || s.name || "").toLowerCase();
        const desc = (s.description || "").toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    // 3. Price Filter
    if (priceFilter === "under500") {
      result = result.filter((s) => (s.price || 0) <= 500);
    } else if (priceFilter === "under1000") {
      result = result.filter((s) => (s.price || 0) <= 1000);
    } else if (priceFilter === "above1000") {
      result = result.filter((s) => (s.price || 0) > 1000);
    }

    // 4. Rating Filter
    if (ratingFilter === "4.8") {
      result = result.filter((s) => (s.rating || 0) >= 4.8);
    } else if (ratingFilter === "4.5") {
      result = result.filter((s) => (s.rating || 0) >= 4.5);
    }

    // 5. Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "rating_desc") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [services, selectedCategory, searchQuery, priceFilter, ratingFilter, sortBy]);

  // Count active filters (for badge)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (priceFilter !== "all") count++;
    if (ratingFilter !== "all") count++;
    if (sortBy !== "recommended") count++;
    return count;
  }, [priceFilter, ratingFilter, sortBy]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === "ALL") {
      router.push("/beauty");
    } else {
      router.push(`/beauty?category=${encodeURIComponent(catId)}`);
    }
  };

  const handleResetFilters = () => {
    setPriceFilter("all");
    setRatingFilter("all");
    setSortBy("recommended");
    setSearchQuery("");
    setSelectedCategory("ALL");
    router.push("/beauty");
    setFilterDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFCFD] text-[#25232A] font-sans antialiased pb-32 lg:pb-16 selection:bg-[#F9E3EC]">
      
      {/* =========================================================================
          A. MOBILE HEADER (Compact Indian App Experience)
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE7E9] shadow-[0_2px_10px_rgba(37,35,42,0.03)]">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Back button + Brand / Address */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go Back"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FCF1F5] text-[#C2306B] border border-[#F9E3EC] active:scale-95 transition-transform"
            >
              <ChevronLeft size={19} strokeWidth={2.5} />
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[14px] font-[950] tracking-tight italic text-[#25232A]">
                  SPARKY<span className="text-[#C2306B]">.</span>
                </span>
                <span className="text-[10px] font-bold text-[#C2306B] uppercase tracking-wider">
                  Beauty
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-[#77717A]">
                <MapPin size={11} className="text-[#C2306B] shrink-0" />
                <span className="text-[11px] font-semibold truncate max-w-[170px] sm:max-w-xs">
                  {userAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Cart Button with live count */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="View Cart"
              className="relative flex h-10 items-center gap-2 rounded-full border border-[#EAE7E9] bg-white px-3.5 py-1.5 shadow-xs active:scale-95 transition-transform"
            >
              <div className="relative">
                <ShoppingCart size={17} className="text-[#25232A]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#C2306B] px-1 text-[9px] font-black text-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-black text-[#25232A]">
                ₹{cartTotal}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar in Header */}
        <div className="px-4 pb-2.5 pt-1 max-w-7xl mx-auto">
          <div className="relative flex h-[40px] items-center rounded-xl bg-[#F7F7F5] border border-[#EAE7E9] px-3 focus-within:bg-white focus-within:border-[#C2306B] focus-within:shadow-xs transition-colors">
            <Search size={15} className="text-[#77717A] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facials, waxing, manicure, makeup..."
              className="flex-1 bg-transparent text-[13px] font-medium text-[#25232A] outline-none placeholder:text-[#77717A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 text-[#77717A] hover:text-[#25232A]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          B. PAGE TITLE & INTRODUCTORY SECTION
          ========================================================================= */}
      <section className="bg-gradient-to-b from-white via-[#FCF1F5]/40 to-transparent px-4 pt-3 pb-2 border-b border-[#F9E3EC]/50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-[950] tracking-tight text-[#25232A]">
            Beauty Services
          </h1>
          <p className="mt-0.5 text-xs text-[#77717A] font-medium">
            Your favourite beauty treatments, delivered with salon hygiene at your doorstep.
          </p>
        </div>
      </section>

      {/* =========================================================================
          C. HORIZONTAL CATEGORY NAVIGATION STRIP
          ========================================================================= */}
      <nav
        aria-label="Beauty Categories"
        className="sticky top-[102px] z-30 bg-white/98 backdrop-blur-md border-b border-[#EAE7E9] py-2.5 shadow-xs"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto px-4 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className="group relative flex shrink-0 flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                {/* Circular / Rounded Icon Container */}
                <div
                  className={`relative flex h-[54px] w-[54px] items-center justify-center rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#FCF1F5] border-2 border-[#C2306B] shadow-[0_2px_10px_rgba(194,48,107,0.18)]"
                      : "bg-[#F7F7F5] border border-[#EAE7E9] group-hover:bg-[#F2EFF1]"
                  }`}
                >
                  <div className="relative h-8 w-8 overflow-hidden">
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      fill
                      sizes="36px"
                      className="object-contain"
                    />
                  </div>

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-3 rounded-full bg-[#C2306B]" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] font-bold text-center tracking-tight leading-none ${
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

      {/* =========================================================================
          D. PROFESSIONAL FILTER & SORTING TOOLBAR
          ========================================================================= */}
      <section className="bg-white border-b border-[#EAE7E9] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            {/* "More Filters" Button */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                activeFiltersCount > 0
                  ? "bg-[#FCF1F5] text-[#C2306B] border-[#C2306B]"
                  : "bg-white text-[#25232A] border-[#EAE7E9] hover:bg-[#F7F7F5]"
              }`}
            >
              <SlidersHorizontal size={13} className={activeFiltersCount > 0 ? "text-[#C2306B]" : "text-[#77717A]"} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C2306B] text-[9px] font-black text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Price Chip: Under ₹500 */}
            <button
              type="button"
              onClick={() => setPriceFilter(priceFilter === "under500" ? "all" : "under500")}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                priceFilter === "under500"
                  ? "bg-[#FCF1F5] text-[#C2306B] border-[#C2306B]"
                  : "bg-white text-[#77717A] border-[#EAE7E9] hover:text-[#25232A]"
              }`}
            >
              Under ₹500
            </button>

            {/* Price Chip: Under ₹1000 */}
            <button
              type="button"
              onClick={() => setPriceFilter(priceFilter === "under1000" ? "all" : "under1000")}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                priceFilter === "under1000"
                  ? "bg-[#FCF1F5] text-[#C2306B] border-[#C2306B]"
                  : "bg-white text-[#77717A] border-[#EAE7E9] hover:text-[#25232A]"
              }`}
            >
              Under ₹1000
            </button>

            {/* Rating Chip: 4.8+ */}
            <button
              type="button"
              onClick={() => setRatingFilter(ratingFilter === "4.8" ? "all" : "4.8")}
              className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                ratingFilter === "4.8"
                  ? "bg-[#FCF1F5] text-[#C2306B] border-[#C2306B]"
                  : "bg-white text-[#77717A] border-[#EAE7E9] hover:text-[#25232A]"
              }`}
            >
              <Star size={11} fill="#f59e0b" className="text-amber-500" />
              <span>4.8+</span>
            </button>
          </div>

          {/* Results Count indicator */}
          <span className="text-[11px] font-semibold text-[#77717A] shrink-0">
            {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"}
          </span>
        </div>
      </section>

      {/* =========================================================================
          E. MAIN CONTENT & URBAN COMPANY STYLE SERVICE CARDS
          ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* -------------------------------------------------------------
              DESKTOP STICKY SIDEBAR (Hidden on mobile)
              ------------------------------------------------------------- */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-5">
            {/* Categories Sidebar */}
            <div className="bg-white rounded-2xl p-4 border border-[#EAE7E9] shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#25232A] mb-3 pb-2 border-b border-[#EAE7E9]">
                All Categories
              </h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-[#FCF1F5] text-[#C2306B]"
                          : "text-[#77717A] hover:bg-[#F7F7F5] hover:text-[#25232A]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative h-5 w-5">
                          <Image src={cat.icon} alt={cat.name} fill className="object-contain" />
                        </div>
                        <span>{cat.name}</span>
                      </div>
                      {isActive && <ChevronRight size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sparky Assured Badge */}
            <div className="bg-[#EEF5F7] rounded-2xl p-4 border border-[#EAE7E9] space-y-2.5">
              <div className="flex items-center gap-1.5 text-[#094B66]">
                <ShieldCheck size={17} />
                <span className="text-xs font-black uppercase tracking-wider">
                  Sparky Assured
                </span>
              </div>
              <ul className="text-[11px] text-[#77717A] space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#094B66] shrink-0" />
                  <span>100% Background Verified Specialists</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#094B66] shrink-0" />
                  <span>Single-Use Sealed Hygienic Kits</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#094B66] shrink-0" />
                  <span>Transparent Upfront Pricing</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* -------------------------------------------------------------
              SERVICE CARDS LIST (Mobile 2-column card layout)
              ------------------------------------------------------------- */}
          <div className="lg:col-span-9 space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#25232A]">
                  {selectedCategory === "ALL" ? "All Beauty Services" : `${selectedCategory} Rituals`}
                </h2>
                <p className="text-xs text-[#77717A]">
                  Showing verified at-home beauty treatments
                </p>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#C2306B] hover:underline"
                >
                  <RotateCcw size={11} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Empty State */}
            {filteredServices.length === 0 ? (
              <div className="rounded-2xl border border-[#EAE7E9] bg-white p-10 text-center shadow-xs">
                <Sparkles size={32} className="mx-auto text-[#77717A] mb-2.5 opacity-60" />
                <h3 className="text-sm font-bold text-[#25232A]">No services match your filters</h3>
                <p className="text-xs text-[#77717A] mt-1 max-w-xs mx-auto">
                  Try adjusting your search query, price limit, or category selection to find what you need.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 rounded-xl bg-[#C2306B] px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Urban Company / Yes Madam 2-Column Service Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredServices.map((service) => {
                  const title = service.name || service.title;
                  const price =
                    typeof service.price === "string"
                      ? parseInt(service.price.replace(/[₹,\s]/g, ""), 10)
                      : service.price;
                  const originalPrice = service.originalPrice || Math.round(price * 1.25);
                  const qty = getItemQuantity(title);

                  return (
                    <div
                      key={service._id || service.serviceId || title}
                      className="group relative flex items-start justify-between gap-3 rounded-2xl border border-[#EAE7E9] bg-white p-3.5 shadow-[0_2px_8px_rgba(37,35,42,0.03)] hover:shadow-md hover:border-[#F9E3EC] transition-all"
                    >
                      {/* Left Side: Information */}
                      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between self-stretch">
                        <div>
                          {/* Rating & Duration */}
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-0.5 text-[10px] font-extrabold text-[#25232A]">
                              <Star size={11} fill="#f59e0b" className="text-amber-500" />
                              <span>{service.rating || "4.8"}</span>
                            </div>
                            <span className="text-[#77717A] text-[9px]">•</span>
                            <div className="flex items-center gap-1 text-[10px] text-[#77717A]">
                              <Clock size={11} />
                              <span>45-60 min</span>
                            </div>
                          </div>

                          {/* Service Title */}
                          <h3
                            onClick={() => router.push(`/services/${encodeURIComponent(title)}`)}
                            className="text-[14px] font-bold text-[#25232A] leading-snug tracking-tight hover:text-[#C2306B] transition-colors cursor-pointer line-clamp-2"
                          >
                            {title}
                          </h3>

                          {/* Price Row */}
                          <div className="flex items-baseline gap-1.5 mt-1.5">
                            <span className="text-[16px] font-black text-[#25232A]">
                              ₹{price}
                            </span>
                            {originalPrice > price && (
                              <span className="text-[11px] font-medium text-[#77717A] line-through">
                                ₹{originalPrice}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-[11px] text-[#77717A] leading-relaxed line-clamp-2 mt-1">
                            {service.description || "Deluxe skincare and salon session with hygienic single-use kits."}
                          </p>
                        </div>

                        {/* View Details link */}
                        <div className="mt-2.5 pt-1.5 border-t border-[#F7F7F5]">
                          <button
                            type="button"
                            onClick={() => router.push(`/services/${encodeURIComponent(title)}`)}
                            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#094B66] hover:underline"
                          >
                            <span>View details</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Right Side: Image with Add / Quantity Button */}
                      <div className="relative flex flex-col items-center shrink-0">
                        {/* Service Thumbnail */}
                        <div
                          onClick={() => router.push(`/services/${encodeURIComponent(title)}`)}
                          className="relative h-[98px] w-[98px] rounded-xl overflow-hidden bg-[#F7F7F5] border border-[#EAE7E9] cursor-pointer"
                        >
                          <Image
                            src={service.image || "/images/goldfacial.webp"}
                            alt={title}
                            fill
                            sizes="100px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Floating Add / Quantity Stepper Button */}
                        <div className="absolute -bottom-2.5">
                          {qty > 0 ? (
                            <div className="flex h-8 items-center rounded-xl bg-white border border-[#C2306B] shadow-md px-1 text-[#25232A]">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(service, -1)}
                                aria-label="Decrease quantity"
                                className="flex h-6 w-6 items-center justify-center rounded-lg text-[#C2306B] active:scale-90"
                              >
                                <Minus size={13} strokeWidth={2.5} />
                              </button>
                              <span className="w-5 text-center text-xs font-black text-[#C2306B]">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(service, 1)}
                                aria-label="Increase quantity"
                                className="flex h-6 w-6 items-center justify-center rounded-lg text-[#C2306B] active:scale-90"
                              >
                                <Plus size={13} strokeWidth={2.5} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(service, 1)}
                              className="flex h-8 items-center justify-center gap-1 rounded-xl bg-white border border-[#C2306B] px-4 text-xs font-black text-[#C2306B] shadow-sm hover:bg-[#FCF1F5] active:scale-95 transition-all cursor-pointer"
                            >
                              <span>ADD</span>
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* =========================================================================
          F. FUNCTIONAL FILTER DRAWER / BOTTOM SHEET
          ========================================================================= */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterDrawerOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative z-10 w-full max-w-lg rounded-t-[28px] sm:rounded-2xl bg-white p-5 shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E9]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={17} className="text-[#C2306B]" />
                  <h3 className="text-base font-black text-[#25232A]">Filter Services</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F7F5] text-[#25232A] hover:bg-[#EAE7E9]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Filters Content */}
              <div className="flex-1 overflow-y-auto py-4 space-y-5 no-scrollbar">
                {/* 1. Sort Options */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#77717A] mb-2.5">
                    Sort By
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "recommended", label: "Recommended" },
                      { id: "rating_desc", label: "Highest Rated" },
                      { id: "price_asc", label: "Price: Low to High" },
                      { id: "price_desc", label: "Price: High to Low" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSortBy(opt.id)}
                        className={`rounded-xl border p-2.5 text-xs font-bold text-left transition-all ${
                          sortBy === opt.id
                            ? "border-[#C2306B] bg-[#FCF1F5] text-[#C2306B]"
                            : "border-[#EAE7E9] bg-white text-[#25232A]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Price Range */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#77717A] mb-2.5">
                    Price Range
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "all", label: "Any Price" },
                      { id: "under500", label: "Under ₹500" },
                      { id: "under1000", label: "Under ₹1000" },
                      { id: "above1000", label: "Above ₹1000" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPriceFilter(opt.id)}
                        className={`rounded-xl border p-2.5 text-xs font-bold text-left transition-all ${
                          priceFilter === opt.id
                            ? "border-[#C2306B] bg-[#FCF1F5] text-[#C2306B]"
                            : "border-[#EAE7E9] bg-white text-[#25232A]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Customer Rating */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#77717A] mb-2.5">
                    Customer Rating
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "all", label: "All" },
                      { id: "4.5", label: "4.5★ & up" },
                      { id: "4.8", label: "4.8★ & up" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRatingFilter(opt.id)}
                        className={`rounded-xl border p-2.5 text-xs font-bold text-center transition-all ${
                          ratingFilter === opt.id
                            ? "border-[#C2306B] bg-[#FCF1F5] text-[#C2306B]"
                            : "border-[#EAE7E9] bg-white text-[#25232A]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sheet Bottom Actions */}
              <div className="pt-3 border-t border-[#EAE7E9] flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex-1 rounded-xl border border-[#EAE7E9] py-3 text-xs font-bold uppercase tracking-wider text-[#77717A] hover:bg-[#F7F7F5]"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 rounded-xl bg-[#C2306B] py-3 text-xs font-black uppercase tracking-wider text-white shadow-md active:scale-95"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          G. FLOATING MOBILE CART PILL
          ========================================================================= */}
      {cart.length > 0 && (
        <div className="fixed bottom-3 left-0 right-0 z-40 px-4 lg:hidden">
          <div className="max-w-md mx-auto">
            <div
              onClick={() => setCartOpen(true)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#C2306B] text-white shadow-xl shadow-[#C2306B]/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <ShoppingCart size={17} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-extrabold">₹{cartTotal}</span>
                  <span className="text-[10px] text-white/80">
                    {cartCount} item{cartCount > 1 ? "s" : ""} added
                  </span>
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-white text-[#C2306B] text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <span>View Bag</span>
                <ChevronRight size={13} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          H. RESPONSIVE CART DRAWER (Bottom Sheet on Mobile, Slide-over on Desktop)
          ========================================================================= */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Cart Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-[#EAE7E9]">
                <div>
                  <h3 className="text-lg font-black text-[#25232A]">Your Booking Bag</h3>
                  <span className="text-[11px] font-bold text-[#77717A]">
                    {cartCount} treatment{cartCount > 1 ? "s" : ""} selected
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F7F5] text-[#25232A]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-[#77717A]">
                    <ShoppingCart size={36} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-bold text-[#25232A]">Your bag is empty</p>
                    <p className="text-xs mt-0.5">Explore treatments and tap ADD to begin booking</p>
                  </div>
                ) : (
                  cart.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F7F7F5] border border-[#EAE7E9]"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-[#EAE7E9] shrink-0">
                          <Image
                            src={item.image || "/images/goldfacial.webp"}
                            fill
                            className="object-cover"
                            alt={item.title}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#25232A] truncate">
                            {item.title}
                          </p>
                          <p className="text-[#C2306B] font-black text-xs mt-0.5">
                            ₹{item.price} × {item.quantity || 1}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = cart.filter((_, idx) => idx !== i);
                            setCart(updated);
                            localStorage.setItem("cart", JSON.stringify(updated));
                            window.dispatchEvent(new Event("storage"));
                            window.dispatchEvent(new Event("sparky-cart-change"));
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#77717A] hover:text-red-500 border border-[#EAE7E9]"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Checkout Action */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-[#EAE7E9] space-y-3 mt-auto">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-[#77717A] uppercase tracking-wider">
                      Total Payable
                    </span>
                    <span className="text-2xl font-black text-[#25232A]">
                      ₹{cartTotal}
                    </span>
                  </div>

                  {minCartError && (
                    <p className="text-xs font-bold text-[#C2306B] bg-[#FCF1F5] p-2 rounded-lg text-center">
                      {minCartError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (cartTotal < MIN_CART_VALUE) {
                        setMinCartError(`Add ₹${MIN_CART_VALUE - cartTotal} more to book`);
                        return;
                      }
                      router.push("/checkout");
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#C2306B] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <span>Proceed to Checkout</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          I. MIN-CART TOAST ERROR
          ========================================================================= */}
      {minCartError && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[110] w-[90%] max-w-sm rounded-2xl bg-white border border-[#EAE7E9] p-3 shadow-xl flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FCF1F5] text-[#C2306B] font-black text-xs">
            ₹
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#25232A] truncate">
              {minCartError}
            </p>
            <p className="text-[10px] text-[#77717A]">
              Minimum booking amount is ₹{MIN_CART_VALUE}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMinCartError("")}
            className="p-1 text-[#77717A]"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
