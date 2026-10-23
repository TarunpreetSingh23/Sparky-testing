"use client";

import Image from "next/image";
import Link from "next/link";
import FloatingOrderTracker from "@/components/FloatingOrderTracker";
import AboutSections from "@/components/AboutSections";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BeautyBannerCarousel from "@/components/BeautyBannerCarosl";
import ValueComboPackages from "@/components/Combos";
import {
  Search,
  Sparkles,
  Heart,
  Plus,
  Wrench,
  X,
  MapPin,
  Star,
  ArrowRight,
  LayoutGrid,
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
  ShieldCheck,
  PhoneCall,
  SlidersHorizontal,
  Bell
} from "lucide-react";
import dynamic from "next/dynamic";
const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });


import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";




/* ================= DATA ================= */

const CATEGORIES = [
  { name: "BEAUTY", icon: <Sparkles size={20} />, ref: "beautyRef" },
  { name: "Beatique", icon: <Scissors size={20} />, ref: "beatiqueRef" },
  { name: "Technical", icon: <Wrench size={20} />, ref: "techRef" },
];

const CRAZY_DEAL = {
  name: "Gold Facial",
  originalPrice: "₹1,875",
  price: 999,
  image: "/images/goldfacial.jpg",
  discount: "45% OFF",
  link: "/services/facial",
  category: "Woman Services"
};

const QUICK_SERVICES = [
  { title: "Suit Stitching", discount: "30% OFF", image: "/images/stitching.jpg", price: 1299, link: "/services/stitching" },
  { title: "AC Repair", discount: "₹200 OFF", image: "/images/crazyAc.avif", price: 499, link: "/services/ac-repair" },
  { title: "Deep Cleanup", discount: "50% OFF", image: "/images/deepc.webp", price: 799, link: "/services/cleaning" },
  { title: "Manicure", discount: "Starts ₹199", image: "/images/mpm.jpg", price: 199, link: "/services/manicure",category: "Woman Services" },
];

const BESTSELLERS = [
  { id: 1, name: "Manicure", image: "/images/mpm.jpg", count: "+120 more", price: 499, link: "/services/manicure", category: "Woman Services" },
  { id: 2, name: "Plumbing", image: "/images/plumbing.jpg", count: "+80 more", price: 299, link: "/services/plumbing" },
  { id: 3, name: "Makeup", image: "/images/makeup.jpg", count: "+150 more", price: 1499, link: "/services/makeup", category: "Woman Services" },
];

const STATIC_SERVICES = [
  { title: "Manicure", price: 499, image: "/images/mpm.jpg", link: "/services/manicure", category: "Woman Services" },
  { title: "Pedicure", price: 599, image: "/images/vee.jpg", link: "/services/pedicure", category: "Woman Services" },
  { title: "Facial", price: 999, image: "/images/vee2.jpg", link: "/services/facial", category: "Woman Services" },
  { title: "Waxing", price: 699, image: "/images/wm.jpg", link: "/services/waxing", category: "Woman Services" },
  { title: "Cleaning", price: 799, image: "/images/cleanup.jpg", link: "/services/cleaning" },
  { title: "AC Repair", price: 499, image: "/images/ac.jpg", link: "/services/ac-repair" },
];
const want = [
  { id: 1, name: 'Pedicure', icon: Scissors,image:"/images/pedicure.png" },
  { id: 2, name: 'Manicure', icon: Zap,image:"/images/manicure.png" },
  { id: 3, name: 'Facial', icon: Sparkles,image:"/images/facial.png" },
  { id: 4, name: 'Bleach', icon: Palette,image:"/images/bleach.png" },
  { id: 5, name: 'Cleanup', icon: Waves,image:"/images/cleanup.png" },
  { id: 6, name: 'Waxing', icon: Wind ,image:"/images/waxing.png"},
  { id: 7, name: 'Makeup', icon: Smile,image:"/images/makeup.png" },
  { id: 8, name: 'Hair', icon: MessageCircle, image:"/images/hair.png"},
  // { id: 7, name: 'Hair', icon: Smile },
  // { id: 8, name: 'Mehndi', icon: MessageCircle },
];
const MOCK_ORDERS = [
  {
    orderId: "ORD-99283",
    status: "pending", // Should show in floating card
    serviceName: "Gold Facial",
    price: 999,
    date: "2026-01-31",
    customerName: "Guest User"
  },
  {
    orderId: "ORD-88122",
    status: "accepted", // Should show in floating card
    serviceName: "AC Repair",
    price: 499,
    date: "2026-01-30",
    customerName: "Guest User"
  },
  {
    orderId: "ORD-77100",
    status: "completed", // Filter should ignore this
    serviceName: "Manicure",
    price: 199,
    date: "2026-01-28",
    customerName: "Guest User"
  },
  {
    orderId: "ORD-00123",
    status: "cancelled", // Filter should ignore this
    serviceName: "Deep Cleanup",
    price: 799,
    date: "2026-01-25",
    customerName: "Guest User"
  }
];
/* ================= PAGE ================= */
const promoData = {
  "Waxing": { 
    title: "3 Step Korean Wax Ritual", 
    tag: "Full Arms, Full Legs & Underarms", 
    img: "/images/waxing.png", 
    price: "799",
    layout: "elegant-minimal" // The screenshot style
  },
  "Facial": { 
    title: "Instant Glow Facial", 
    tag: "Premium Herbal Range", 
    img: "/images/fruitfacial.webp", 
    price: "1299",
    layout: "soft-gradient" 
  },
  "Mehandi": { 
    title: "Bridal Mehandi Artist", 
    tag: "Traditional & Modern Designs", 
    img: "/images/mehandi.jpg", 
    price: "499",
    layout: "bold-split" 
  },
  "Makeup": { 
    title: "Party Makeup Look", 
    tag: "Professional MUA Choice", 
    img: "/images/makeup.png", 
    price: "1599",
    layout: "elegant-minimal" 
  },
  "Haircare": { 
    title: "Saga Hair Spa", 
    tag: "Deep Root Nourishment", 
    img: "/images/hair.jpg", 
    price: "899",
    layout: "floating-circle" 
  },
  "Bleach": { 
    title: "Oxy Glow Bleach", 
    tag: "Even Skin Tone", 
    img: "/images/bleach.png", 
    price: "299",
    layout: "soft-gradient" 
  }
};

export default function SparkyServiceApp() {
const navcolour = "#C2306B";
const herocolour = "#FFD9C9";
const herobutton = "#C2306B";
const mainbg = "transparent";
// const router=useRouter();

  const beautyRef = useRef(null);
  const beatiqueRef = useRef(null);
  const techRef = useRef(null);
  const searchRef = useRef(null);
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [address, setAddress] = useState("Tap To Select Address");
  const router = useRouter();
  const [orders, setorders] = useState([])
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selected, setSelected] = useState(null);
  const [minCartError, setMinCartError] = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
const AMRITSAR_BOUNDS = [
  { lat: 31.670068, lng: 74.862815 },
  { lat: 31.657253, lng: 74.919065 },
  { lat: 31.596597, lng: 74.877805 },
  { lat: 31.630555, lng: 74.779767 },
];

const isInsidePolygon = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;
    const intersect = yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};
  const active = orders.find(order => 
   order.status !== 'cancelled' && order.status !== 'completed'
   );
  console.log(active)
  const refs = { beautyRef, beatiqueRef, techRef };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }finally {
  setServicesLoading(false);
}
    };
    fetchServices();
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/by-phone");
        const data = await res.json();
        setorders(data);
        
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
  setOrdersLoading(false);
}
    };
    fetchOrders();
  }, []);

  // Scroll-direction detection for mobile header
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 40) {
        setHeaderVisible(true);
      } else if (currentY < lastScrollY.current - 4) {
        // scrolling UP even a little -> float down
        setHeaderVisible(true);
      } else if (currentY > lastScrollY.current + 8) {
        // scrolling DOWN -> hide header
        setHeaderVisible(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
   const checkAmritsar = (lat, lng) => {
    if (!lat || !lng) return false;
    const inside = isInsidePolygon({ lat, lng }, AMRITSAR_BOUNDS);
    setOutOfBounds(!inside);
    return inside;
  };
// Filter for orders that are neither 'cancelled' nor 'completed'
   const getCartTotal = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

 const MIN_CART_VALUE = 299;

const handleBooking = (service) => {
  const itemToAdd = {
    title: service.name || service.title,
    price: typeof service.price === 'string'
      ? parseInt(service.price.replace('₹', ''))
      : service.price,
    image: service.image,
    quantity: 1,
    category: service.category,
    earning: service.earning,
    profit: service.profit,
  };

  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  existingCart.push(itemToAdd);
  localStorage.setItem("cart", JSON.stringify(existingCart));

  const total = getCartTotal();

  if (total < MIN_CART_VALUE) {
    const remaining = MIN_CART_VALUE - total;
    setMinCartError(`Add at least ₹${remaining} service`);
    return; // ❌ Stop navigation
  }

  setMinCartError("");
  router.push("/checkout");
};


  useEffect(() => {
  // Only search if user has typed at least 2 characters
  if (query.trim().length < 2) {
    setResults([]);
    setOpen(false);
    return;
  }

  // Filter the services fetched from your database API
  const filtered = services.filter((s) => {
    const serviceTitle = (s.name || s.title || "").toLowerCase();
    const serviceCategory = (s.category || "").toLowerCase();
    const searchTerm = query.toLowerCase();
    
    return serviceTitle.includes(searchTerm) || serviceCategory.includes(searchTerm);
  });

  setResults(filtered.slice(0, 6)); // Show top 6 matches
  setOpen(true);
}, [query, services]);
useEffect(() => {
  const savedAddress = localStorage.getItem("user_address_text");

  if (savedAddress) {
    setAddress(savedAddress);
  }
}, []);


  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollTo = (refKey) => {
    const target = refs[refKey];
    if (target && target.current) {
      window.scrollTo({
        top: target.current.offsetTop - 110,
        behavior: "smooth",
      });
    }
  };
if (servicesLoading || services.length === 0) {
  return <SparkySkeletonPage />;
}

  const handleWantClick = (wantName) => {
  setSelected(wantName); // Optional: if you want to highlight the clicked item

  // 1. Find all service titles on the page
  // We look for h3 tags (used in ServiceAppCard) or h2 tags (Drawer)
  const serviceElements = document.querySelectorAll("h3, h2");
  
  let targetElement = null;

  // 2. Loop through to find a match
  for (const el of serviceElements) {
    if (el.textContent.toLowerCase().includes(wantName.toLowerCase())) {
      targetElement = el;
      break;
    }
  }

  // 3. Scroll to the element if found
  if (targetElement) {
    const offset = 120; // Adjust based on your sticky header height
    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    
    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });

    // Optional: Add a brief "highlight" effect to the found service
    const card = targetElement.closest('.group');
    if (card) {
      card.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
      setTimeout(() => {
        card.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
      }, 2000);
    }
  }
};

  return (
    <div 
      style={{
        background: "linear-gradient(180deg, #FFF8F6 0%, #FFF1F5 52%, #FFF7FB 100%)",
      }} 
      className="min-h-screen w-full flex justify-center text-[#2B1B2E]"
    >
  <div
    className="
      w-full 
      max-w-full lg:max-w-7xl 
      min-h-screen 
      relative
      overflow-hidden
    "
  >
    <div className="min-h-screen text-[#2B1B2E] pb-32 lg:pb-16 font-sans overflow-x-hidden">
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
              <UserMap setAddress={(addr, lat, lng) => {
                setAddress(addr);
                setPendingLocation({ lat, lng });
              }} />

              <AnimatePresence>
                {outOfBounds && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-[#2B1B2E]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping scale-150 opacity-20" />
                      <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 rounded-full flex items-center justify-center border border-yellow-500/30">
                        <AlertTriangle size={48} className="text-yellow-500" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Not Serving In Your Area</h2>
                    <p className="text-slate-300 text-base max-w-[280px]">Sparky currently only serves the heart of <span className="text-[#FFD9C9] font-extrabold underline decoration-[#C2306B]/50">Amritsar</span>.</p>
                    <button onClick={() => setOutOfBounds(false)} className="btn-secondary mt-12 px-7 py-3 text-[10px] uppercase tracking-[0.2em]">
                      Back
                    </button>
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
  JSON.stringify({ address, lat, lng })
);

// 🔥 ADD THIS
localStorage.setItem("user_address_text", address);

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
      {/* ================= HEADER ================= */}
      {/* ================= MOBILE HEADER (Visible on < 1024px) ================= */}
      <header
        style={{ 
          transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
          background: 'linear-gradient(110deg, #FFF0EB 0%, #FCEAF1 55%, #F0E5FF 100%)',
        }}
        className="
          lg:hidden
          fixed top-0 left-0 right-0
          z-50
          px-5 pt-3 pb-4
          rounded-b-[30px]
          border-b border-[#F1DFE8]
          shadow-[0_8px_24px_rgba(105,43,79,0.06)]
          transition-transform duration-300 ease-out
        "
      >
        {/* TOP ROW: Location on Left, Brand & Notification on Right */}
        <div className="flex items-center justify-between mb-3 h-[44px]">
          {/* LEFT — LOCATION */}
          <div
            onClick={() => setShowMap(true)}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-[#F1DFE8] flex items-center justify-center shadow-xs shrink-0">
              <MapPin size={15} className="text-[#C2306B]" />
            </div>

            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[13px] font-[700] text-[#2B1B2E] tracking-tight">
                Home
              </span>
              <span className="text-[10px] text-[#8D788D] font-medium truncate max-w-[170px]">
                {address}
              </span>
            </div>
          </div>

          {/* RIGHT — BRAND & NOTIFICATION */}
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-[900] tracking-[0.2em] text-[#2B1B2E]">
              SPARKY<span className="text-[#C2306B]">.</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-white/90 border border-[#F1DFE8] flex items-center justify-center text-[#2B1B2E] shadow-xs">
              <Bell size={15} className="text-[#2B1B2E]" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER ROW */}
        <div className="flex items-center gap-2.5">
          <div ref={searchRef} className="relative flex-1">
            <div className="flex items-center h-[44px] bg-white rounded-full px-4 border border-[#F1DFE8] shadow-xs">
              <Search size={15} className="text-[#8D788D] mr-2 shrink-0" />
              <input
                placeholder="Search services"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[12px] font-medium text-[#2B1B2E] placeholder:text-[#8D788D]"
              />
              {query && (
                <X
                  size={14}
                  className="text-[#8D788D] hover:text-[#2B1B2E] cursor-pointer"
                  onClick={() => setQuery("")}
                />
              )}
            </div>

            {/* DROPDOWN */}
            {open && results.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-[1.6rem] shadow-xl border border-[#F1DFE8] z-[999] overflow-hidden">
                {results.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setQuery("");
                      setOpen(false);
                      setSelectedService(item);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFF7F3] cursor-pointer transition-colors"
                  >
                    <Image
                      src={item.image || "/images/placeholder.jpg"}
                      width={40}
                      height={40}
                      className="rounded-xl object-cover"
                      alt=""
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#2B1B2E]">{item.name || item.title}</p>
                      <p className="text-xs text-[#8D788D]">{item.category}</p>
                    </div>
                    <span className="font-extrabold text-sm text-[#C2306B]">₹{item.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CIRCULAR FILTER BUTTON */}
          <button
            onClick={() => router.push('/beauty')}
            className="btn-icon w-[44px] h-[44px] text-[#C2306B] shrink-0"
            aria-label="Filter"
          >
            <SlidersHorizontal size={17} />
          </button>
        </div>
      </header>

      {/* Spacer for fixed mobile header */}
      <div className="lg:hidden h-[116px]" />

      {/* ================= HERO SECTION (From About Page - Full Width & Clean) ================= */}
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

            {/* ACTION CTA BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-4"
            >
              <Link
                href="/beauty"
                className="btn-primary-pill px-6 py-3.5 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Explore Services</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="btn-secondary-pill px-6 py-3.5 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <PhoneCall size={15} className="text-[#C2306B]" />
                <span>Contact Us</span>
              </Link>
            </motion.div>
          </div>

          {/* STATS STRIP */}
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
 {/* <section className="px-4 -mt-0">
        <div 
        style={{ backgroundColor: herocolour }}
          onClick={() => router.push('/beauty')}
          className="relative cursor-pointer w-full aspect-[4/3]  rounded-t-full overflow-hidden flex flex-col items-center justify-center border-b-8 border-[#424A2B] active:scale-[0.99] transition-transform"
        >
          <div className="text-center px-10">
            <h2 className="text-5xl font-serif font-light text-grey-500 italic">Korean</h2>
            <h2 className="text-4xl font-bold text-grey-500 uppercase tracking-tight -mt-2">Beauty Range</h2>
            <div style={{ backgroundColor: herobutton }} className="mt-4  text-white px-6 py-2 rounded-lg inline-block">
              <span className="text-sm font-medium">starting @</span>
              <span className="text-xl font-black ml-1">₹749</span>
            </div>
          </div>
          <div className="absolute bottom-0 w-full h-12 bg-white/20 backdrop-blur-sm" />
        </div>
      </section> */}
      {/* ================= MAIN CONTENT ================= */}
      <main className="px-2 sm:px-4 lg:px-6 space-y-8 pt-2">
        <section className="mt-2 px-2 sm:px-4">
  <div className="
    max-w-md lg:max-w-7xl mx-auto
    p-4 sm:p-6 lg:p-7
    rounded-[24px]
    bg-white
    border border-[#F1DFE8]
    shadow-[0_4px_18px_rgba(105,43,79,0.07)]
  ">

    {/* Heading */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-[#F5E8ED]">
      <div>
        <h2 className="
          text-[18px] sm:text-xl lg:text-2xl
          font-[800] text-center
          tracking-tight
          text-[#2B1B2E]
        ">
          Our Services
        </h2>
        <p className="text-xs text-center text-[#8D788D] mt-0.5">Select a category to view curated treatments</p>
      </div>

      {/* <button
        onClick={() => router.push('/beauty')}
        className="text-xs font-bold text-[#C2306B] hover:text-[#A82058] flex items-center gap-1 self-start sm:self-auto transition-colors"
      >
        <span>View Full Catalog</span>
        <ChevronRight size={13} />
      </button> */}
    </div>

    {/* Grid: 4 cols on mobile, 8 cols on laptop */}
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3.5 lg:gap-4">

      {want.map((cat, i) => (
        <button
          key={i}
          onClick={() => handleWantClick(cat.name)}
          className="group flex flex-col items-center gap-2 p-1.5 rounded-2xl hover:bg-[#FFF7F3] transition-all"
        >
          {/* Image Tile */}
          <div 
            style={{
              background: "linear-gradient(180deg, #FFF7F3 0%, #FFF1F4 65%, #F8E5ED 100%)",
            }}
            className="
              relative w-full aspect-square
              max-w-[76px] sm:max-w-[84px]
              rounded-2xl overflow-hidden
              border border-[#F1DFE8]
              shadow-xs
              group-hover:shadow-md
              group-hover:-translate-y-1
              transition-all duration-200
            "
          >
            <Image
              src={cat.image || "/images/sremovebg.png"}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
              alt={cat.name}
            />

            {/* subtle overlay shine */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#C2306B]/5 to-transparent opacity-40" />
          </div>

          {/* Label */}
          <span className="
            text-[11px] sm:text-xs
            font-bold
            text-center
            text-[#2B1B2E]
            group-hover:text-[#C2306B]
            transition-colors
            tracking-tight
          ">
            {cat.name}
          </span>
        </button>
      ))}

    </div>

  </div>
</section>


{minCartError && (
  <div
    className="fixed bottom-13 left-1/2 -translate-x-1/2 z-[100]
    w-[90%] max-w-xs
    bg-white/90 backdrop-blur-2xl
    border border-[#F1DFE8]
    shadow-[0_10px_40px_rgba(105,43,79,0.12)]
    rounded-2xl px-4 py-3
    flex items-center gap-3
    animate-in fade-in slide-in-from-bottom-4 duration-300"
  >
    {/* Gradient 3D Icon */}
    <div className="relative shrink-0">
      <div className="w-10 h-10 rounded-xl
        bg-gradient-to-r from-[#C2306B] via-[#A83DAA] to-[#8E4FD6]
        flex items-center justify-center
        text-white text-sm font-semibold
        shadow-md shadow-[#C2306B]/30"
      >
        ₹
      </div>
    </div>

    {/* Text */}
    <div className="flex-1">
      <p className="text-xs font-semibold text-[#2B1B2E] leading-tight">
         <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2306B] via-[#A83DAA] to-[#8E4FD6] font-bold">
          {minCartError}
        </span> more
      </p>
      <p className="text-[10px] text-[#8D788D] font-medium">
        to proceed to checkout
      </p>

      {/* Minimal Progress */}
      <div className="mt-2 h-[3px] w-full bg-[#F5E8ED] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C2306B] via-[#A83DAA] to-[#8E4FD6] transition-all duration-700 ease-out rounded-full"
          style={{ width: "70%" }} 
        />
      </div>
    </div>
  </div>
)}
 {/* SPARKY BEAUTY PROMO BANNER */}
<BeautyBannerCarousel/>
 {/* MOBILE-ONLY BEAUTY SERVICES */}
<section ref={beautyRef} className="pt-1 lg:hidden">
  <FloatingOrderTracker activeOrder={active} />

  {[
    "Waxing",
    "Facial",
    "Mehandi",
    "Haircare",
    "Threading",
    "Makeup",
    
  ].map((subCat) => {
    const filteredServices = services.filter(
      (item) =>
        item.category === "Woman Services" &&
        (item.name || item.title || "")
          .toLowerCase()
          .includes(subCat.toLowerCase())
    );

    if (filteredServices.length === 0) return null;

    const displayServices = filteredServices.slice(0, 3);

    return (
     <div key={subCat} className="mb-7">
  {/* CATEGORY HEADER */}
  <div className="mb-3 flex items-center justify-between px-3">
    <h3 className="flex items-center gap-2 text-[15px] font-extrabold tracking-tight text-[#2B1B2E]">
      <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[#E98CB0] to-[#A51F56]" />
      {subCat}
    </h3>

    <button
      type="button"
      onClick={() =>
        router.push(
          `/beauty?category=${encodeURIComponent(subCat.toUpperCase())}`
        )
      }
      className="inline-flex items-center gap-1 rounded-full border border-[#C2306B]/15 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#C2306B] shadow-sm backdrop-blur-md transition-colors hover:bg-[#FFF0F6]"
    >
      View All
      <ChevronRight size={13} />
    </button>
  </div>

  {/* MAXIMUM 3 CARDS PER ROW */}
  <div className="grid grid-cols-3 gap-3 px-2 sm:px-4">
    {displayServices.map((item) => {
      const image =
        item.image || item.imageUrl || item.thumbnail || item.photo;
      const title = item.name || item.title || subCat;

      const price =
        Number(String(item.price ?? 0).replace(/[₹,\s]/g, "")) || 0;

      const originalPrice = Math.round(price * 1.2);

      return (
        <div
          key={item.id}
          onClick={() => setSelectedService(item)}
          className="group min-w-0 overflow-hidden rounded-[20px] border border-[#F3E8ED] bg-white p-2.5 shadow-[0_3px_12px_rgba(194,48,107,0.04)] transition-all duration-300 active:scale-[0.98]"
        >
          {/* Image */}
          <div className="relative aspect-[4/4.3] overflow-hidden rounded-[14px] bg-[#FCEEF4]">
            {image ? (
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Wrench className="text-[#C2306B]/40" size={25} />
              </div>
            )}

            {/* Gradient + Add button */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#321321]/10 to-transparent" />

            <button
              type="button"
              aria-label={`Select ${title}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedService(item);
              }}
              className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-xl border border-white/60 bg-gradient-to-br from-[#E98CB0] via-[#C2306B] to-[#A51F56] text-white shadow-[0_4px_12px_rgba(194,48,107,0.25)] transition-transform hover:scale-105 active:scale-90"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Title */}
          <h4 className="mt-3 min-h-[30px] line-clamp-2 text-[11px] font-bold leading-[1.4] text-[#2B1B2E]">
            {title}
          </h4>

          {/* Price + 20% higher crossed-out price */}
          <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <span className="text-[12px] font-extrabold text-[#C2306B]">
              ₹{price}
            </span>

            <span className="text-[10px] font-medium text-gray-400 line-through decoration-gray-400">
              ₹{originalPrice}
            </span>
          </div>
        </div>
      );
    })}
  </div>
</div>
    );
  })}
</section>
<ValueComboPackages/>
<section ref={beautyRef} className="pt-1 lg:hidden">
  <FloatingOrderTracker activeOrder={active} />

  {[
    
    "Bleach",
    "Cleanup",
    "Manicure",
    "Pedicure",
    "Hair",
    "Mehndi",
  ].map((subCat) => {
    const filteredServices = services.filter(
      (item) =>
        item.category === "Woman Services" &&
        (item.name || item.title || "")
          .toLowerCase()
          .includes(subCat.toLowerCase())
    );

    if (filteredServices.length === 0) return null;

    const displayServices = filteredServices.slice(0, 3);

    return (
      <div
          key={item.id}
          onClick={() => setSelectedService(item)}
          className="group min-w-0 overflow-hidden rounded-[20px] border border-[#F3E8ED] bg-white p-2.5 shadow-[0_3px_12px_rgba(194,48,107,0.04)] transition-all duration-300 active:scale-[0.98]"
        >
          {/* Image */}
          <div className="relative aspect-[4/4.3] overflow-hidden rounded-[14px] bg-[#FCEEF4]">
            {image ? (
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Wrench className="text-[#C2306B]/40" size={25} />
              </div>
            )}

            {/* Gradient + Add button */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#321321]/10 to-transparent" />

            <button
              type="button"
              aria-label={`Select ${title}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedService(item);
              }}
              className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-xl border border-white/60 bg-gradient-to-br from-[#E98CB0] via-[#C2306B] to-[#A51F56] text-white shadow-[0_4px_12px_rgba(194,48,107,0.25)] transition-transform hover:scale-105 active:scale-90"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Title */}
          <h4 className="mt-3 min-h-[30px] line-clamp-2 text-[11px] font-bold leading-[1.4] text-[#2B1B2E]">
            {title}
          </h4>

          {/* Price + 20% higher crossed-out price */}
          <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <span className="text-[12px] font-extrabold text-[#C2306B]">
              ₹{price}
            </span>

            <span className="text-[10px] font-medium text-gray-400 line-through decoration-gray-400">
              ₹{originalPrice}
            </span>
          </div>
        </div>
    );
  })}
</section>

        {/* ================= ABOUT SECTIONS (Story, Pillars, Steps, Comparison, Reviews, CTA) — Desktop Only ================= */}
        <div className="hidden lg:block">
          <AboutSections />
        </div>
      </main>

      {/* ================= BOTTOM SLIDE DRAWER (CSS TRANSITION) ================= */}
      {/* Backdrop */}
      <div 
        onClick={() => setSelectedService(null)}
        className={`fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px] transition-opacity duration-300 ${selectedService ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />
      
      {/* Drawer */}
<div
  style={{
    background: "linear-gradient(180deg, #FFFFFF 0%, #FFF7F3 100%)",
  }}
  className={`fixed 
    z-[70]
    overflow-hidden
    border-t border-[#F1DFE8]
    transition-all duration-300 ease-out
    /* Mobile: Slide-up Bottom Sheet */
    bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] rounded-t-[2.5rem] shadow-[0_-18px_45px_rgba(105,43,79,0.18)]
    /* Laptop: Centered Modal Dialog */
    lg:top-1/2 lg:bottom-auto lg:left-1/2 lg:-translate-x-1/2 lg:max-w-lg lg:rounded-[2.5rem] lg:shadow-2xl lg:border
    ${selectedService 
      ? "translate-y-0 lg:-translate-y-1/2 opacity-100 visible" 
      : "translate-y-full lg:opacity-0 lg:invisible pointer-events-none"}`}
>
  {/* Drag Handle (Mobile only) */}
  <div className="w-10 h-1.5 bg-[#F1DFE8] rounded-full mx-auto mt-3 mb-3 lg:hidden" />

  {selectedService && (
    <div className="px-6 pb-7 pt-1">

      {/* Image */}
      <div className="relative w-full h-56 rounded-[1.9rem] overflow-hidden mb-5
        shadow-[0_12px_28px_rgba(105,43,79,0.12)]
        border border-white/60"
      >
        <Image
          src={selectedService.image}
          fill
          className="object-cover"
          alt="Service Detail"
        />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-white/10" />

        {/* Close */}
        <button
          onClick={() => setSelectedService(null)}
          className="btn-icon w-9 h-9 absolute top-3 right-3 shadow-md"
        >
          <X size={16} className="text-[#2B1B2E]" />
        </button>
      </div>

      {/* Title + Price */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-[20px] font-semibold text-[#2B1B2E] leading-snug tracking-tight">
            {selectedService.name || selectedService.title}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-yellow-500">
              <Star size={13} fill="currentColor" />
              <span className="ml-1 text-[12px] font-semibold text-[#2B1B2E]">
                4.9
              </span>
            </div>

            <span className="text-[#C2306B]">•</span>

            <span className="text-[9px] font-semibold uppercase tracking-widest text-[#C2306B]">
              Verified
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[22px] font-semibold text-[#C2306B] tracking-tight">
            ₹{selectedService.price || "799"}
          </p>
          <p className="text-[9px] text-[#8D788D] uppercase tracking-widest">
            Base
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[#6F5B70] leading-relaxed mb-6 font-normal text-[13px]">
        {selectedService.description ||
          "Premium at-home service delivered by trained professionals using hygienic, salon-grade products."}
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-3">
        {/* Primary */}
        <button
          onClick={() => handleBooking(selectedService)}
          className="btn-primary flex-1 py-3.5 text-[11px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2"
        >
          Book Now<ArrowRight size={14} />
        </button>

        {/* Secondary */}
        <button
          onClick={() => router.push(`services/${selectedService.title}`)}
          className="btn-secondary flex-1 py-3.5 text-[11px] font-semibold uppercase tracking-widest"
        >
          Details
        </button>
      </div>
    </div>
  )}
</div>

    </div>
      </div>
</div>
  );
}

/* ================= HELPER COMPONENTS ================= */
function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[100]">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <Image 
          src="/images/wLogo.png" 
          alt="Logo" 
          width={120} 
          height={40} 
          className="mb-8 object-contain" 
        />
        
        {/* Progress Bar Container */}
        <div className="relative w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden">
          {/* Moving Indicator */}
          <div className="loading-bar-element absolute h-full w-1/2 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
        </div>
        
        {/* Text */}
       
      </div>

      {/* Scoped CSS for the animation */}
      <style jsx>{`
        .loading-bar-element {
          animation: loading-slide 1.5s infinite ease-in-out;
        }

        @keyframes loading-slide {
          0% {
            left: -100%;
          }
          50% {
            left: 25%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
// import Image from 'next/image';
// import { Plus } from 'lucide-react'; // Optional: Use an icon library like lucide-react

function ServiceAppCard({ item }) {
  const dummyPrice = Math.round(item.price * 1.3);

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #FFFCFD 100%)",
      }}
      className="
        group relative flex w-full flex-col
        rounded-2xl
        border border-[#F1DFE8]
        hover:border-[#C2306B]/40
        overflow-hidden
        transition-all duration-300
        hover:-translate-y-1
        shadow-[0_4px_14px_rgba(43,27,46,0.05)]
        hover:shadow-[0_8px_20px_rgba(105,43,79,0.1)]
        cursor-pointer
        h-full
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden bg-[#FFF7F3]">
        <Image
          src={item.image}
          fill
          className="
            object-cover
            transition-transform duration-500 ease-out
            group-hover:scale-105
          "
          alt={item.name || item.title}
        />

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Rating Badge */}
        {item.rating && (
          <div
            className="
              absolute top-2 right-2
              bg-white/95 backdrop-blur-xs
              px-2 py-0.5
              rounded-full
              text-[9px]
              font-bold
              text-[#2B1B2E]
              shadow-xs
              border border-[#F1DFE8]
              flex items-center gap-0.5
            "
          >
            <Star size={9} fill="#facc15" className="text-yellow-400" />
            {item.rating}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 justify-between p-2.5 sm:p-3">
        {/* TITLE */}
        <h3
          className="
            text-xs font-bold
            text-[#2B1B2E]
            leading-snug
            line-clamp-2
            min-h-[30px]
            tracking-tight
            group-hover:text-[#C2306B]
            transition-colors
          "
        >
          {item.name || item.title}
        </h3>

        {/* PRICE + ACTION */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5E8ED]">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8D788D] line-through leading-none">
              ₹{dummyPrice}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-[#C2306B] leading-tight">
              ₹{item.price}
            </span>
          </div>

          {/* ADD BUTTON */}
          <button
            className="btn-primary-pill w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center !p-0"
            aria-label="Add to cart"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Skeleton({ className }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[#F7E5EE] ${className}`} />
  );
}

function HeaderSkeleton() {
  return (
    <header className="bg-gradient-to-br from-[#C2306B] via-[#A51F56] to-[#7B1040] px-4 pt-5 pb-8 rounded-b-[2.5rem] shadow-lg">
      <Skeleton className="h-3.5 w-28 mb-2 bg-white/30" />
      <Skeleton className="h-5 w-44 mb-5 bg-white/30" />
      <Skeleton className="h-12 w-full rounded-2xl bg-white/40" />
    </header>
  );
}

function ServicesGridSkeleton() {
  return (
    <section className="mt-5 px-4">
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#F1DFE8]">
        <Skeleton className="h-5 w-36 mx-auto mb-5" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="h-2.5 w-12" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceSectionSkeleton() {
  return (
    <section className="pt-5">
      <div className="px-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-1 h-5 rounded-full bg-[#E98CB0]" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3 px-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[20px] p-2.5 border border-[#F1DFE8] shadow-sm">
            <Skeleton className="w-full aspect-square rounded-[14px] mb-2.5 bg-[#FCEEF4]" />
            <Skeleton className="h-2.5 w-full mb-1" />
            <Skeleton className="h-2.5 w-2/3 mb-2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="w-5 h-5 rounded-full bg-[#FCEEF4]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SparkySkeletonPage() {
  return (
    <div className="min-h-screen bg-[#FFF7F3] flex justify-center">
      <div className="w-full max-w-full lg:max-w-7xl min-h-screen pb-3 relative overflow-hidden">
        <HeaderSkeleton />
        <ServicesGridSkeleton />
        <ServiceSectionSkeleton />
        <ServiceSectionSkeleton />
        <ServiceSectionSkeleton />
      </div>
    </div>
  );
}
function SubCategoryPromo({ subCat }) {
  const data = promoData[subCat];

  if (!data || !data.layout) {
    return <div className="mx-4 h-2 bg-[#f8f9f5] rounded-full opacity-50" />;
  }

  /* LAYOUT 1: THE "YES MADAM" ARCH (Classic Screenshot Style) */
  if (data.layout === "arch-classic") {
    return (
      <div className="mx-2 mt-5 relative h-52 rounded-[2.5rem] bg-[#f9c27d] overflow-hidden border border-[#e0e5d2] shadow-sm group">
        <div className="absolute top-0 left-0 bg-[#a66d2d] text-white text-[10px] font-bold px-5 py-1.5 rounded-br-[1.5rem] z-20">
          {data.tag}
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center pl-8 w-1/2">
          <h4 className="text-[28px] font-black text-[#1a2421] leading-tight mb-2 tracking-tighter">
            {data.title}
          </h4>
          <p className="text-xl font-black text-[#1a2421]">@ ₹{data.price}</p>
          <button className="mt-4 w-32 bg-[#a66d2d] text-white py-2 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition">
            Book Now
          </button>
        </div>
        <div className="absolute right-0 bottom-0 w-[60%] h-full">
           <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f9c27d] to-transparent z-10" />
           {/* Architectural Arch Shape */}
           <div className="absolute top-4 right-4 bottom-0 left-0 bg-white/20 rounded-t-full border-t-4 border-white/30" />
           <Image src={data.img} fill className="object-cover object-center translate-y-4" alt="promo" />
        </div>
      </div>
    );
  }

  /* LAYOUT 2: THE GLASS CARD (High-End Aesthetic) */
  if (data.layout === "glass-card") {
    return (
      <div className="mx-2 mt-5 relative h-48 rounded-[2.5rem] overflow-hidden border border-white/20 shadow-xl group">
        <Image src={data.img} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" alt="promo" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 backdrop-blur-xl bg-white/10 border border-white/20 p-5 rounded-[2rem]">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-black text-white leading-none uppercase tracking-tighter">{data.title}</h4>
              <p className="text-white/70 text-[10px] font-bold mt-1 uppercase tracking-widest">{data.tag}</p>
            </div>
            <div className="bg-[#f7b614] text-black h-10 w-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition">
              <ArrowRight size={20} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* LAYOUT 3: BOLD SPLIT (High Conversion) */
  if (data.layout === "bold-split") {
    return (
      <div className="mx-2 mt-5 relative h-40 bg-[#1A2421] rounded-[2.5rem] overflow-hidden flex items-center group border-t-4 border-[#3A4D39]">
        <div className="flex-1 pl-8 pr-4 py-6 z-10">
          <span className="bg-[#f7b614] text-black text-[8px] font-black px-3 py-1 rounded-full uppercase mb-2 inline-block">Flash Deal</span>
          <h4 className="text-xl font-black text-white leading-tight italic">{data.title}</h4>
          <p className="text-white/60 text-[10px] mt-1 font-bold">Limited slots available nearby</p>
        </div>
        <div className="relative w-[45%] h-full skew-x-[-12deg] translate-x-6 border-l-8 border-[#3A4D39] overflow-hidden shadow-2xl">
          <Image src={data.img} fill className="object-cover unskew-x-[12deg] scale-125" alt="promo" />
        </div>
      </div>
    );
  }

  /* LAYOUT 4: ELEGANT MINIMAL (Focus on Cleanliness) */
  if (data.layout === "elegant-minimal") {
    return (
      <div className="mx-2 mt-5 h-36 rounded-[2rem] bg-white border border-[#E0E5D2] flex items-center p-2 shadow-sm">
        <div className="relative h-full aspect-square rounded-[1.5rem] overflow-hidden">
          <Image src={data.img} fill className="object-cover" alt="promo" />
        </div>
        <div className="flex-1 px-6">
          <p className="text-[10px] font-black text-[#4F6F52] tracking-[0.2em] uppercase mb-1">Saga Select</p>
          <h4 className="text-lg font-black text-[#1A2421] leading-none mb-2 tracking-tighter">{data.title}</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-[#3A4D39]">₹{data.price}</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">Best Value</span>
          </div>
        </div>
        <div className="pr-4"><Plus className="text-[#3A4D39]" size={24} strokeWidth={3} /></div>
      </div>
    );
  }

  /* LAYOUT 5: FLOATING CIRCLE (Branded Geometric) */
  if (data.layout === "floating-circle") {
    return (
      <div className="mx-2 mt-5 h-32 bg-[#F5F7F2] rounded-[2.5rem] border border-[#dfe5d2] flex items-center overflow-hidden relative group">
        <div className="flex-1 pl-8">
          <h4 className="text-xl font-black text-[#1A2421] leading-tight italic">{data.title}</h4>
          <p className="text-[#4F6F52] font-black text-[10px] uppercase tracking-widest mt-1 opacity-70">{data.tag}</p>
        </div>
        <div className="relative h-full w-[45%] bg-[#3A4D39] rounded-l-full flex items-center justify-center border-l-8 border-white group-hover:w-[50%] transition-all duration-500">
           <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image src={data.img} fill className="object-cover" alt="promo" />
           </div>
        </div>
      </div>
    );
  }

  /* LAYOUT 6: SOFT GRADIENT (Calm & Soothing) */
  if (data.layout === "soft-gradient") {
    return (
      <div className="mx-2 mt-5 h-44 rounded-[2.5rem] bg-gradient-to-r from-[#edf1e5] to-[#f9fbf4] border border-white p-6 relative overflow-hidden flex flex-col justify-center">
        <div className="z-10 relative">
          <Star className="text-[#f7b614] mb-3" fill="#f7b614" size={20} />
          <h4 className="text-2xl font-black text-[#3A4D39] leading-tight tracking-tighter w-2/3">{data.title}</h4>
          <p className="text-[11px] font-bold text-gray-500 mt-2 uppercase tracking-widest">{data.tag}</p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-white/40 blur-3xl rounded-full" />
        <div className="absolute right-4 bottom-4 w-28 h-28 rounded-[2rem] overflow-hidden shadow-2xl rotate-6 group-hover:rotate-0 transition-transform">
          <Image src={data.img} fill className="object-cover" alt="promo" />
        </div>
      </div>
    );
  }

  return null;
}