"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
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
  Minus,
  Check,
} from "lucide-react";

const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });

/* ================= SPARKY BRAND PALETTE ================= */
const SPARKY_COLORS = {
  primary: "#C2306B", // Primary brand pink
  blush: "#FCF1F5", // Light blush
  roseSoft: "#F9E3EC", // Soft rose
  teal: "#094B66", // Deep teal
  blueLight: "#EEF5F7", // Light blue
  cream: "#F7F0EB", // Warm cream
  sage: "#F4F3EA", // Soft sage
  sageAccent: "#C0BC91", // Sage accent
  brownDeep: "#55210A", // Deep brown
  text: "#25232A", // Main text
  muted: "#77717A", // Secondary text
  border: "#EAE7E9", // Border
  white: "#FFFFFF",
};

/* ================= STATIC DESKTOP CATEGORIES (100% PRESERVED) ================= */
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

/* ================= AUTHENTIC REAL BACKEND SERVICES INITIAL STATE ================= */
const INITIAL_AUTHENTIC_SERVICES = [
  {
    _id: "69732308571e98b320e89e87",
    serviceId: "WU12_GOLD_FACIAL",
    category: "Woman Services",
    title: "GOLD FACIAL",
    name: "GOLD FACIAL",
    description: "Multi-step luxurious gold leaf facial stimulating collagen, smoothing fine lines, and restoring bridal shine.",
    price: 1200,
    rating: 4.8,
    image: "/images/goldfacial.webp",
    steps: [
      "Step 1 – Deep Cleansing: Removes surface impurities & makeup.",
      "Step 2 – Golden Exfoliation: Gentle gold bead scrub unclogs pores.",
      "Step 3 – Steam & Extraction: Removes blackheads and whiteheads safely.",
      "Step 4 – Nourishing Massage: Therapeutic gold cream facial massage.",
      "Step 5 – 24K Gold Glow Pack: Brightening peel/clay mask.",
      "Step 6 – Hydrating Serum: Locks in luminosity and elasticity.",
    ],
  },
  {
    _id: "69732308571e98b320e89e88",
    serviceId: "WU13_DIAMOND_FACIAL",
    category: "Woman Services",
    title: "DIAMOND FACIAL",
    name: "DIAMOND FACIAL",
    description: "Micro-exfoliation and brightening diamond serum treatment for brilliant crystal glow.",
    price: 1100,
    rating: 4.9,
    image: "/images/diamondfacial.webp",
  },
  {
    _id: "69732308571e98b320e89e89",
    serviceId: "WU14_FRUIT_FACIAL",
    category: "Woman Services",
    title: "FRUIT FACIAL",
    name: "FRUIT FACIAL",
    description: "Vitamin-rich organic fruit extract facial that detoxifies, hydrates, and restores natural radiance.",
    price: 999,
    rating: 4.7,
    image: "/images/fruitfacial.webp",
  },
  {
    _id: "69732308571e98b320e89e8e",
    serviceId: "WU19_DEEP_CLEANUP",
    category: "Woman Services",
    title: "DEEP CLEANUP",
    name: "DEEP CLEANUP",
    description: "Thorough blackhead cleansing, steam exfoliation, and detoxifying pore-tightening pack.",
    price: 1500,
    rating: 4.8,
    image: "/images/deepcleanup.webp",
  },
  {
    _id: "69732308571e98b320e89e8d",
    serviceId: "WU18_INTENSE_CLEANUP",
    category: "Woman Services",
    title: "INTENSE CLEANUP",
    name: "INTENSE CLEANUP",
    description: "Deep pore suction, comedone extraction, steam, and pore-minimizing clay mask.",
    price: 1100,
    rating: 4.8,
    image: "/images/intensecleanup.webp",
  },
  {
    _id: "69732308571e98b320e89e8c",
    serviceId: "WU17_GENTLE_CLEANUP",
    category: "Woman Services",
    title: "GENTLE CLEANUP",
    name: "GENTLE CLEANUP",
    description: "Mild cleansing, soothing massage, and refreshing mask for sensitive skin types.",
    price: 1000,
    rating: 4.7,
    image: "/images/gentlecleanup.webp",
  },
  {
    _id: "69732308571e98b320e89e82",
    serviceId: "WU07_FULL_BODY_WAXING",
    category: "Woman Services",
    title: "FULL BODY WAXING",
    name: "FULL BODY WAXING",
    description: "Full body head-to-toe waxing ritual for velvety, radiant, hair-free skin.",
    price: 2000,
    rating: 4.9,
    image: "/images/fullbodywaxing.webp",
  },
  {
    _id: "69732308571e98b320e89e7f",
    serviceId: "WU04_FULL_ARM_WAXING",
    category: "Woman Services",
    title: "FULL ARM WAXING",
    name: "FULL ARM WAXING",
    description: "Complete hair removal for arms using gentle wax that leaves skin soft, clean, and irritation-free.",
    price: 700,
    rating: 4.8,
    image: "/images/fullarmwaxing.webp",
  },
  {
    _id: "69732308571e98b320e89e81",
    serviceId: "WU06_FULL_LEGS_WAXING",
    category: "Woman Services",
    title: "FULL LEGS WAXING",
    name: "FULL LEGS WAXING",
    description: "Smooth full-leg waxing covering toes to thighs with hygienic roll-on technology.",
    price: 750,
    rating: 4.8,
    image: "/images/fulllegwaxing.webp",
  },
  {
    _id: "69732308571e98b320e89e7d",
    serviceId: "WU02_UNDERARM_WAXING",
    category: "Woman Services",
    title: "UNDERARM WAXING",
    name: "UNDERARM WAXING",
    description: "Quick stripless underarm waxing removing dark hair and brightening the area.",
    price: 200,
    rating: 4.8,
    image: "/images/underarmwaxing.webp",
  },
  {
    _id: "69732308571e98b320e89e83",
    serviceId: "WU08_BIKINI_LINE_WAXING",
    category: "Woman Services",
    title: "BIKINI LINE WAXING",
    name: "BIKINI LINE WAXING",
    description: "Hygienic, sensitive peel-off waxing for clean and smooth bikini contour lines.",
    price: 1100,
    rating: 4.7,
    image: "/images/bikiniline.jpg",
  },
  {
    _id: "69732308571e98b320e89e8f",
    serviceId: "WU20_CLASSIC_MANICURE",
    category: "Woman Services",
    title: "CLASSIC MANICURE",
    name: "CLASSIC MANICURE",
    description: "Warm soak, gentle exfoliating hand scrub, cuticle grooming, nail buffing, and relaxing massage.",
    price: 550,
    rating: 4.7,
    image: "/images/classicmanicure.webp",
  },
  {
    _id: "69732308571e98b320e89ea4",
    serviceId: "WU41_CLEANUP_MANICURE",
    category: "Woman Services",
    title: "CLEANUP MANICURE",
    name: "CLEANUP MANICURE",
    description: "Deep detan hand cleanup, brightening mask, nail shaping, and relaxing cream massage.",
    price: 750,
    rating: 4.7,
    image: "/images/cleanupmanicure.webp",
  },
  {
    _id: "69732308571e98b320e89e90",
    serviceId: "WU21_CLASSIC_PEDICURE",
    category: "Woman Services",
    title: "CLASSIC PEDICURE",
    name: "CLASSIC PEDICURE",
    description: "Relaxing foot soak, cuticle treatment, heel scrub, and soothing foot massage.",
    price: 700,
    rating: 4.7,
    image: "/images/classicpedicure.webp",
  },
  {
    _id: "69732308571e98b320e89ea2",
    serviceId: "WU39_CLEANUP_PEDICURE",
    category: "Woman Services",
    title: "CLEANUP PEDICURE",
    name: "CLEANUP PEDICURE",
    description: "Intense foot spa with deep cracked-heel exfoliation and calming herbal soak.",
    price: 1000,
    rating: 4.7,
    image: "/images/cleanuppedicure.webp",
  },
  {
    _id: "69732308571e98b320e89e97",
    serviceId: "WU28_CURLS_AND_WAVES",
    category: "Woman Services",
    title: "CURLS AND WAVES",
    name: "CURLS AND WAVES",
    description: "Voluminous tong curls or beachy mermaid waves set with long-lasting holding spray.",
    price: 1100,
    rating: 4.8,
    image: "/images/curlsandwaves.webp",
  },
  {
    _id: "69732308571e98b320e89e99",
    serviceId: "WU30_HAIR_STRAIGHTENING",
    category: "Woman Services",
    title: "HAIR STRAIGHTENING",
    name: "HAIR STRAIGHTENING",
    description: "Thermal heat protection and silky smooth flat iron straightening for sleek frizz-free hair.",
    price: 550,
    rating: 4.8,
    image: "/images/hairstrait.webp",
  },
  {
    _id: "69732308571e98b320e89e9a",
    serviceId: "WU31_HAIR_WASH_AND_BLOWDRY",
    category: "Woman Services",
    title: "HAIR WASH AND BLOWDRY",
    name: "HAIR WASH AND BLOWDRY",
    description: "Clarifying hair cleanse, deep conditioner, and bouncy salon blowdry finish.",
    price: 750,
    rating: 4.7,
    image: "/images/hairwash.webp",
  },
  {
    _id: "69732308571e98b320e89e96",
    serviceId: "WU27_FRENCH_HAIR_BRAIDS",
    category: "Woman Services",
    title: "FRENCH HAIR BRAIDS",
    name: "FRENCH HAIR BRAIDS",
    description: "Intricately styled French braids providing a neat, elegant, and secure hairstyle for parties and special gatherings.",
    price: 1000,
    rating: 4.7,
    image: "/images/frenchbraids.webp",
  },
  {
    _id: "69732308571e98b320e89ea1",
    serviceId: "WU38_BRIDAL_MAKEUP",
    category: "Woman Services",
    title: "BRIDAL MAKEUP",
    name: "BRIDAL MAKEUP",
    description: "Premium high-definition bridal transformation with custom jewelry setting, draping, and setting.",
    price: 10000,
    rating: 4.9,
    image: "/images/bridalmakeup.webp",
  },
  {
    _id: "69732308571e98b320e89e91",
    serviceId: "WU22_PARTY_MAKEUP",
    category: "Woman Services",
    title: "PARTY MAKEUP",
    name: "PARTY MAKEUP",
    description: "Glamorous party makeover featuring defined eyes, flattering contours, and glowing finish.",
    price: 3000,
    rating: 4.8,
    image: "/images/partymakeup.webp",
  },
  {
    _id: "69732308571e98b320e89e92",
    serviceId: "WU23_ENGAGEMENT_MAKEUP",
    category: "Woman Services",
    title: "ENGAGEMENT MAKEUP",
    name: "ENGAGEMENT MAKEUP",
    description: "Camera-ready HD glamour makeup customized for ring ceremonies and celebratory evening lighting.",
    price: 4000,
    rating: 4.8,
    image: "/images/engagementmakeup.webp",
  },
  {
    _id: "69732308571e98b320e89e93",
    serviceId: "WU24_NUDE_MAKEUP",
    category: "Woman Services",
    title: "NUDE MAKEUP",
    name: "NUDE MAKEUP",
    description: "A soft and natural makeup look that enhances features subtly for a fresh, radiant appearance. Ideal for daily wear or understated elegance.",
    price: 2000,
    rating: 4.7,
    image: "/images/nudemakeup.webp",
  },
  {
    _id: "69732308571e98b320e89e8b",
    serviceId: "WU16_DIAMOND_BLEACH",
    category: "Woman Services",
    title: "DIAMOND BLEACH",
    name: "DIAMOND BLEACH",
    description: "Sparkling diamond dust bleach treatment matching facial hair to natural skin tone with zero burn.",
    price: 299,
    rating: 4.6,
    image: "/images/diamondbleach.webp",
  },
  {
    _id: "69732308571e98b320e89e8a",
    serviceId: "WU15_GOLD_BLEACH",
    category: "Woman Services",
    title: "GOLD BLEACH",
    name: "GOLD BLEACH",
    description: "Shimmering gold bleach providing golden radiance and lightening tan gently.",
    price: 299,
    rating: 4.6,
    image: "/images/goldbleach.webp",
  },
  {
    _id: "69732308571e98b320e89ea3",
    serviceId: "WU40_FRUIT_BLEACH",
    category: "Woman Services",
    title: "FRUIT BLEACH",
    name: "FRUIT BLEACH",
    description: "Mild herbal fruit bleach gentle on delicate facial skin with fruity aroma.",
    price: 299,
    rating: 4.5,
    image: "/images/fruitbleach.webp",
  },
  {
    _id: "69732308571e98b320e89e9b",
    serviceId: "WU32_EYEBROW_THREADING",
    category: "Woman Services",
    title: "EYEBROW THREADING",
    name: "EYEBROW THREADING",
    description: "A precise eyebrow threading service to shape and define eyebrows for a neat and polished look. Enhances facial symmetry while maintaining natural eyebrow appearance.",
    price: 40,
    rating: 4.8,
    image: "/images/eyebrowthreading.webp",
  },
  {
    _id: "69732308571e98b320e89e9c",
    serviceId: "WU33_UPPER_LIP_THREADING",
    category: "Woman Services",
    title: "UPPER LIP THREADING",
    name: "UPPER LIP THREADING",
    description: "Gentle organic cotton thread hair removal for smooth, clean upper lip area.",
    price: 40,
    rating: 4.8,
    image: "/images/upperlipthreading.webp",
  },
  {
    _id: "69732308571e98b320e89e9f",
    serviceId: "WU36_FULL_FACE_NECK_THREADING",
    category: "Woman Services",
    title: "FULL FACE AND NECK THREADING",
    name: "FULL FACE AND NECK THREADING",
    description: "Comprehensive threading service for brows, forehead, upper lips, chin, and neck.",
    price: 150,
    rating: 4.8,
    image: "/images/fullfaceandneckthreading.webp",
  },
  {
    _id: "69732308571e98b320e89e9d",
    serviceId: "WU34_BRIDAL_MEHNDI",
    category: "Woman Services",
    title: "BRIDAL MEHNDI",
    name: "BRIDAL MEHNDI",
    description: "Detailed bridal mehndi art featuring intricate traditional motifs, dark stain quality, and customized hand and feet coverage.",
    price: 15000,
    rating: 4.9,
    image: "/images/wm.jpg",
  },
  {
    _id: "69732308571e98b320e89e9e",
    serviceId: "WU35_BASIC_MEHNDI",
    category: "Woman Services",
    title: "BASIC MEHNDI",
    name: "BASIC MEHNDI",
    description: "Graceful henna designs for hands ideal for festive occasions, family gatherings, and festivals.",
    price: 800,
    rating: 4.6,
    image: "/images/wm.jpg",
  },
];

/* ================= SERVICE IMAGE FALLBACK RESOLVER ================= */
function getServiceImage(service) {
  if (!service) return "/images/goldfacial.webp";
  const img = service.image || service.imageUrl || service.thumbnail;
  if (img && typeof img === "string" && img.startsWith("/")) {
    if (img.includes("mehndi")) {
      return "/images/wm.jpg";
    }
    return img;
  }
  return "/images/goldfacial.webp";
}

/* ================= HOMEPAGE SERVICE CATEGORIES DEFINITION ================= */
const CATEGORY_SECTIONS = [
  {
    id: "facials",
    title: "Facials & Cleanups",
    subtitle: "Deep pore-cleansing and radiant glow rituals with single-use kits",
    accentColor: SPARKY_COLORS.primary,
    bgAccent: SPARKY_COLORS.blush,
    tagColor: SPARKY_COLORS.primary,
    seeAllHref: "/beauty?category=FACIAL",
    matcher: (s) => {
      const t = (s.title || s.name || "").toLowerCase();
      const c = (s.category || "").toLowerCase();
      return t.includes("facial") || t.includes("cleanup") || c.includes("facial");
    },
  },
  {
    id: "waxing",
    title: "Waxing & Smooth Skin",
    subtitle: "Painless chocolate roll-on & honey waxing for satin-soft skin",
    accentColor: SPARKY_COLORS.primary,
    bgAccent: SPARKY_COLORS.roseSoft,
    tagColor: "#A82058",
    seeAllHref: "/beauty?category=WAXING",
    matcher: (s) => {
      const t = (s.title || s.name || "").toLowerCase();
      return (t.includes("wax") || t.includes("bikini")) && !t.includes("facial");
    },
  },
  {
    id: "hair",
    title: "Hair Spa & Styling",
    subtitle: "Salon blowdrys, therapeutic root spa & festive braided hairstyles",
    accentColor: SPARKY_COLORS.teal,
    bgAccent: SPARKY_COLORS.blueLight,
    tagColor: SPARKY_COLORS.teal,
    seeAllHref: "/beauty?category=HAIR",
    matcher: (s) => {
      const t = (s.title || s.name || "").toLowerCase();
      return (
        t.includes("hair") ||
        t.includes("braid") ||
        t.includes("juda") ||
        t.includes("curls")
      );
    },
  },
  {
    id: "manicure",
    title: "Manicure & Pedicure",
    subtitle: "Relaxing foot soak, cuticle groom, heel scrub & tension massage",
    accentColor: SPARKY_COLORS.brownDeep,
    bgAccent: SPARKY_COLORS.cream,
    tagColor: SPARKY_COLORS.brownDeep,
    seeAllHref: "/beauty?category=MANICURE",
    matcher: (s) => {
      const t = (s.title || s.name || "").toLowerCase();
      return t.includes("manicure") || t.includes("pedicure");
    },
  },
  {
    id: "makeup",
    title: "Party & Bridal Makeup",
    subtitle: "HD & airbrush glam tailored for functions by certified artists",
    accentColor: SPARKY_COLORS.primary,
    bgAccent: SPARKY_COLORS.blush,
    tagColor: SPARKY_COLORS.primary,
    seeAllHref: "/beauty?category=MAKEUP",
    matcher: (s) => {
      const t = (s.title || s.name || "").toLowerCase();
      return t.includes("makeup");
    },
  },
  {
    id: "bleach",
    title: "Glow Bleach & Detan",
    subtitle: "Instant radiance & sun-tan reversal with soothing pre/post creams",
    accentColor: SPARKY_COLORS.sageAccent,
    bgAccent: SPARKY_COLORS.sage,
    tagColor: "#676337",
    seeAllHref: "/beauty?category=BLEACH",
    matcher: (s) => {
      const t = (s.title || s.name || "").toLowerCase();
      return t.includes("bleach") || t.includes("detan");
    },
  },
  {
    id: "threading",
    title: "Threading & Facial Grooming",
    subtitle: "Precision organic cotton threading for neat, symmetrical brows",
    accentColor: SPARKY_COLORS.primary,
    bgAccent: SPARKY_COLORS.blush,
    tagColor: SPARKY_COLORS.primary,
    seeAllHref: "/beauty?category=THREADING",
    matcher: (s) => {
      const t = (s.title || s.name || "").toLowerCase();
      return t.includes("threading");
    },
  },
  {
    id: "mehndi",
    title: "Mehndi Rituals",
    subtitle: "Exquisite organic henna art for brides and festival celebrations",
    accentColor: SPARKY_COLORS.brownDeep,
    bgAccent: SPARKY_COLORS.cream,
    tagColor: SPARKY_COLORS.brownDeep,
    seeAllHref: "/beauty?category=ALL",
    matcher: (s) => {
      const t = (s.title || s.name || "").toLowerCase();
      return t.includes("mehndi");
    },
  },
  {
    id: "cleaning",
    title: "Home Deep Cleaning",
    subtitle: "Hospital-grade sanitization, sofa wash & kitchen deep cleansing",
    accentColor: SPARKY_COLORS.teal,
    bgAccent: SPARKY_COLORS.blueLight,
    tagColor: SPARKY_COLORS.teal,
    seeAllHref: "/clean",
    matcher: (s) => {
      const c = (s.category || "").toLowerCase();
      const t = (s.title || s.name || "").toLowerCase();
      return (
        c.includes("cleaning") ||
        t.includes("cleaning") ||
        t.includes("sofa") ||
        t.includes("bathroom")
      );
    },
  },
  {
    id: "eventdecor",
    title: "Event Decoration",
    subtitle: "Bespoke balloon arches, floral setups & celebration styling",
    accentColor: SPARKY_COLORS.brownDeep,
    bgAccent: SPARKY_COLORS.cream,
    tagColor: SPARKY_COLORS.brownDeep,
    seeAllHref: "/eventdecor",
    matcher: (s) => {
      const c = (s.category || "").toLowerCase();
      const t = (s.title || s.name || "").toLowerCase();
      return c.includes("event") || t.includes("decor");
    },
  },
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
  const [services, setServices] = useState(INITIAL_AUTHENTIC_SERVICES);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [minCartError, setMinCartError] = useState("");
  const [mobileCategoryFilter, setMobileCategoryFilter] = useState("all");

  const MIN_CART_VALUE = 299;

  // Amritsar Delivery Boundary Definition (Preserved)
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

  // Sync Cart from LocalStorage
  const syncCart = useCallback(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setCart(JSON.parse(saved));
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("sparky-cart-change", syncCart);
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("sparky-cart-change", syncCart);
    };
  }, [syncCart]);

  // Fetch Services from Database API
  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Services API failed: ${res.status}`);
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching services:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setServicesLoading(false);
        }
      }
    };

    fetchServices();
    return () => controller.abort();
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
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Live Search Logic connecting to DB services
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

  // Lock body scroll when popup is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedService]);

  // Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedService(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Cart total calculator
  const cartTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  }, [cart]);

  // Check how many of a service are currently in cart
  const getCartQuantity = useCallback(
    (service) => {
      if (!service) return 0;
      const title = service.name || service.title;
      const found = cart.find((i) => i.title === title);
      return found ? found.quantity || 1 : 0;
    },
    [cart]
  );

  // Add service to cart
  const handleAddToCart = (e, service) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!service) return;

    const itemToAdd = {
      title: service.name || service.title,
      price:
        typeof service.price === "string"
          ? parseInt(service.price.replace(/[₹,\s]/g, ""), 10)
          : service.price,
      image: getServiceImage(service),
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
      existingCart[existingIndex].quantity =
        (existingCart[existingIndex].quantity || 1) + 1;
    } else {
      existingCart.push(itemToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("sparky-cart-change"));

    toast.success(`${itemToAdd.title} added to bag!`, {
      icon: "🛍️",
      style: {
        borderRadius: "14px",
        background: "#25232A",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "700",
      },
    });

    const newTotal = existingCart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    if (newTotal < MIN_CART_VALUE) {
      const remaining = MIN_CART_VALUE - newTotal;
      setMinCartError(`Add ₹${remaining} more service`);
    } else {
      setMinCartError("");
    }
  };

  // Stepper quantity update for detail modal
  const handleUpdateQuantity = (service, delta) => {
    if (!service) return;
    const title = service.name || service.title;
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const index = existingCart.findIndex((i) => i.title === title);

    if (index > -1) {
      const currentQty = existingCart[index].quantity || 1;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        existingCart.splice(index, 1);
      } else {
        existingCart[index].quantity = newQty;
      }
    } else if (delta > 0) {
      existingCart.push({
        title,
        price:
          typeof service.price === "string"
            ? parseInt(service.price.replace(/[₹,\s]/g, ""), 10)
            : service.price,
        image: getServiceImage(service),
        quantity: 1,
        category: service.category || "Woman Services",
        earning: service.earning || 0,
        profit: service.profit || 0,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("sparky-cart-change"));
  };

  // Immediate "Book Now" action
  const handleBookNow = (service) => {
    if (!service) return;
    const qty = getCartQuantity(service);
    if (qty === 0) {
      handleAddToCart(null, service);
    }
    setSelectedService(null);
    router.push("/cart");
  };

  // Scroll to section when desktop category is clicked (Preserved)
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

  // Group backend services into authentic category sections
  const groupedCategories = useMemo(() => {
    const safeServices = Array.isArray(services) && services.length > 0
      ? services
      : INITIAL_AUTHENTIC_SERVICES;

    const sections = CATEGORY_SECTIONS.map((sec) => {
      const matched = safeServices.filter(sec.matcher);
      return {
        ...sec,
        services: matched,
      };
    }).filter((sec) => sec.services.length > 0);

    // Apply mobile category strip filter if selected
    if (mobileCategoryFilter === "all" || !mobileCategoryFilter) {
      return sections;
    }

    // Map strip IDs to category sections
    const idMap = {
      beauty: "facials",
      clean: "facials",
      eventdecor: "makeup",
      haute: "waxing",
      hair: "hair",
      manicure: "manicure",
    };

    const targetId = idMap[mobileCategoryFilter] || mobileCategoryFilter;
    const filtered = sections.filter(
      (sec) =>
        sec.id.toLowerCase().includes(targetId.toLowerCase()) ||
        sec.title.toLowerCase().includes(targetId.toLowerCase())
    );

    return filtered.length > 0 ? filtered : sections;
  }, [services, mobileCategoryFilter]);

  // Handle Mobile Category Strip selection with smooth scroll
  const handleMobileCategorySelect = (catId) => {
    if (mobileCategoryFilter === catId) {
      setMobileCategoryFilter("all");
      return;
    }
    setMobileCategoryFilter(catId);

    const idMap = {
      beauty: "cat-facials",
      clean: "cat-facials",
      eventdecor: "cat-makeup",
      haute: "cat-waxing",
      hair: "cat-hair",
      manicure: "cat-manicure",
    };

    const targetElId = idMap[catId];
    if (targetElId) {
      setTimeout(() => {
        const el = document.getElementById(targetElId);
        if (el) {
          const offset = 90;
          const pos = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: pos - offset, behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F5] lg:bg-gradient-to-b lg:from-[#FFF8F6] lg:via-[#FFF1F5] lg:to-[#FFF7FB] text-[#25232A]">
      {/* ================= USER MAP MODAL (PRESERVED) ================= */}
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
                className="btn-icon w-11 h-11 shadow-lg bg-white rounded-full flex items-center justify-center cursor-pointer"
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
                      className="mt-8 px-8 py-3 bg-white text-[#25232A] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
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
                    : "btn-primary-pill bg-[#C2306B] text-white cursor-pointer"
                }`}
              >
                <CheckCircle2 size={18} /> Confirm Location
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 4. MOBILE HEADER (Compact, Location-First, Search-Ready) ================= */}
      <header className="lg:hidden sticky top-0 left-0 right-0 z-40 bg-white border-b border-[#EAE7E9] px-3.5 pt-2.5 pb-2.5 shadow-[0_2px_10px_rgba(37,35,42,0.04)]">
        {/* Top Row: Brand & Delivery Promise + Location Selector + Account Shortcut */}
        <div className="flex items-center justify-between mb-2">
          {/* Left: Brand + Location */}
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-[950] tracking-tight italic text-[#25232A]">
                SPARKY<span className="text-[#C2306B]">.</span>
              </span>
              <span className="text-[10px] font-semibold text-[#77717A] tracking-tight truncate">
                • Doorstep Salon & Services
              </span>
            </div>

            {/* Location Selector Pill */}
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="inline-flex items-center gap-1 text-left mt-0.5 focus:outline-none cursor-pointer group active:opacity-80"
            >
              <MapPin size={12} className="text-[#C2306B] shrink-0" />
              <span className="text-[12px] font-black text-[#25232A] truncate max-w-[210px] tracking-tight">
                {address}
              </span>
              <ChevronDown size={12} className="text-[#77717A] shrink-0" />
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7F7F5] border border-[#EAE7E9] text-[#25232A] shadow-xs active:scale-95 transition-transform cursor-pointer"
            aria-label="User Account"
          >
            <User size={15} className="text-[#25232A]" />
          </button>
        </div>

        {/* Bottom Row: Search Bar + Filter Icon */}
        <div className="flex items-center gap-2">
          <div ref={searchRef} className="relative flex-1">
            <div className="flex h-[40px] items-center rounded-xl bg-[#F7F7F5] border border-[#EAE7E9] px-3 transition-colors focus-within:bg-white focus-within:border-[#C2306B]/50 focus-within:shadow-xs">
              <Search size={15} className="text-[#77717A] mr-2 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search facials, waxing, hair spa, cleanup..."
                className="flex-1 bg-transparent text-[12.5px] font-medium text-[#25232A] outline-none placeholder:text-[#77717A]"
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
                        src={getServiceImage(item)}
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
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-xl bg-[#F7F7F5] border border-[#EAE7E9] text-[#25232A] shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <SlidersHorizontal size={15} className="text-[#25232A]" />
          </button>
        </div>
      </header>

      {/* ================= 5. HORIZONTAL CATEGORY NAVIGATION (Mobile Only) ================= */}
      <MobileCategoryStrip
        activeCategory={mobileCategoryFilter}
        onSelectCategory={handleMobileCategorySelect}
      />

      {/* Quick "All Categories" Reset Pill when filtered */}
      {mobileCategoryFilter !== "all" && (
        <div className="lg:hidden px-3.5 pt-2 flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#77717A]">
            Showing filtered category
          </span>
          <button
            type="button"
            onClick={() => setMobileCategoryFilter("all")}
            className="text-[11px] font-extrabold text-[#C2306B] underline cursor-pointer"
          >
            Show All Categories
          </button>
        </div>
      )}

      {/* ================= 6. MOBILE FESTIVAL HERO SECTION (Mobile Only) ================= */}
      <MobileFestivalHero />

      {/* ================= 7. PROMOTIONAL SERVICE CARDS (Mobile Only) ================= */}
      <MobilePromoCards />

      {/* ================= DESKTOP HERO SECTION (100% PRESERVED FOR LAPTOPS) ================= */}
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
              Salon Luxury & Master Care,{" "}
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
              calls, no bargaining, and zero compromises on hygiene.
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

      {/* ================= DESKTOP CATEGORY ICONS STRIP (PRESERVED) ================= */}
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

      {/* ================= DESKTOP BEAUTY BANNER CAROUSEL (PRESERVED) ================= */}
      <div className="hidden lg:block">
        <BeautyBannerCarousel />
      </div>

      {/* ================= 8. MAIN SERVICE DISCOVERY (EXACT 3-CARD MOBILE LAYOUT) ================= */}
      <main className="px-3.5 sm:px-4 lg:px-6 space-y-7 pt-4 pb-28 lg:pb-16 max-w-7xl mx-auto">
        {/* Active Order Floating Tracker */}
        {activeOrder && (
          <div className="block lg:hidden">
            <FloatingOrderTracker activeOrder={activeOrder} />
          </div>
        )}

        {/* LOADING SKELETON */}
        {servicesLoading && (
          <div className="space-y-6 block">
            {[1, 2].map((k) => (
              <div key={k} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-36 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((card) => (
                    <div
                      key={card}
                      className="w-[calc((100%-16px)/3)] min-w-[calc((100%-16px)/3)] h-44 rounded-2xl bg-white border border-[#EAE7E9] p-2 space-y-2 animate-pulse"
                    >
                      <div className="aspect-square w-full rounded-xl bg-gray-200" />
                      <div className="h-3 w-3/4 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= CATEGORY SERVICE SECTIONS (3 CARDS PER ROW MOBILE) ================= */}
        {!servicesLoading &&
          groupedCategories.map((group) => {
            return (
              <section
                key={group.id}
                id={`cat-${group.id}`}
                className="space-y-2.5 scroll-mt-24"
              >
                {/* Section Header: Heading on left, Subtitle, See all on right */}
                <div className="flex items-center justify-between gap-3 px-0.5 mb-3">
  {/* Category title */}
  <div className="flex items-center gap-2.5 min-w-0">
    <span
      className="w-[3px] h-8 rounded-full shrink-0"
      style={{ backgroundColor: group.accentColor }}
    />

    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="text-[16px] min-[380px]:text-[17px] font-bold tracking-[-0.35px] leading-tight text-[#25232A] truncate">
          {group.title}
        </h3>

        <span
          className="inline-flex items-center justify-center min-w-[22px] h-[19px] px-1.5 rounded-md text-[10px] font-semibold leading-none shrink-0"
          style={{
            backgroundColor: group.bgAccent,
            color: group.tagColor,
          }}
        >
          {group.services.length}
        </span>
      </div>

      {group.subtitle && (
        <p className="text-[11px] text-[#77717A] font-normal leading-[15px] mt-1 truncate">
          {group.subtitle}
        </p>
      )}
    </div>
  </div>

  {/* See all */}
  <Link
    href={group.seeAllHref}
    className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[-0.1px] shrink-0 py-2 pl-2 transition-opacity active:opacity-60"
    style={{ color: group.accentColor }}
  >
    See all
    <ChevronRight size={14} strokeWidth={2} />
  </Link>
</div>

                {/* 
                  3-CARDS PER ROW MOBILE HORIZONTAL PRESENTATION:
                  - flex with gap-2 (8px gap)
                  - card width = calc((100% - 16px) / 3)
                  - snap-x snap-mandatory for smooth native snapping
                  - scrollbar-none to hide scrollbar while preserving touch scrolling
                  - lg:grid lg:grid-cols-4 xl:grid-cols-6 on desktop for spacious luxury layout
                */}
                <div className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-1 pt-0.5 -mx-3.5 px-3.5 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 xl:grid-cols-6 lg:gap-4 lg:overflow-visible">
                  {group.services.map((service) => {
                    const image = getServiceImage(service);
                    const title = service.name || service.title;
                    const price =
                      Number(
                        String(service.price ?? 0).replace(/[₹,\s]/g, "")
                      ) || 0;
                    const cartQty = getCartQuantity(service);
                    const isInCart = cartQty > 0;

                    return (
                      <div
                        key={service._id || service.serviceId || title}
                        onClick={() => setSelectedService(service)}
                        className="w-[calc((100vw-28px-16px)/3)] min-w-[calc((100vw-28px-16px)/3)] max-w-[calc((100vw-28px-16px)/3)] lg:w-auto lg:min-w-0 lg:max-w-none shrink-0 snap-start flex flex-col justify-between overflow-hidden rounded-[14px] min-[380px]:rounded-[16px] border border-[#EAE7E9] bg-white p-1.5 min-[380px]:p-2 shadow-[0_2px_8px_rgba(37,35,42,0.04)] active:scale-[0.98] transition-all cursor-pointer group hover:border-[#C2306B]/30 hover:shadow-md"
                      >
                        {/* Service Image with Rating & Compact Add Button */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-[10px] min-[380px]:rounded-[12px] bg-[#FAF7F8]">
                          <Image
                            src={image}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 120px, 200px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Star Rating Badge on Image */}
                          {service.rating && (
                            <div className="absolute top-1 left-1 flex items-center gap-0.5 rounded-full bg-white/95 px-1 py-0.5 text-[8.5px] min-[380px]:text-[9px] font-black text-[#25232A] shadow-xs border border-[#EAE7E9]/80 backdrop-blur-xs">
                              <Star
                                size={8.5}
                                fill="#F59E0B"
                                className="text-amber-500"
                              />
                              <span>{service.rating}</span>
                            </div>
                          )}

                          {/* Compact Add Button (Yes Madam / Urban Company style) */}
                          <button
                            type="button"
                            aria-label={`Add ${title}`}
                            onClick={(e) => handleAddToCart(e, service)}
                            className={`absolute bottom-1 right-1 flex items-center justify-center rounded-md px-1.5 min-[380px]:px-2 py-0.5 text-[9px] min-[380px]:text-[9.5px] font-black uppercase tracking-wider transition-all shadow-xs active:scale-90 cursor-pointer ${
                              isInCart
                                ? "bg-[#C2306B] text-white border border-[#C2306B]"
                                : "bg-white text-[#C2306B] border border-[#C2306B] hover:bg-[#FCF1F5]"
                            }`}
                          >
                            {isInCart ? (
                              <span className="flex items-center gap-0.5">
                                <Check size={10} strokeWidth={3} />
                                <span>{cartQty}</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5">
                                
                                <Plus size={9} strokeWidth={3} />
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Service Details below image */}
                        <div className="mt-1.5 flex flex-col justify-between flex-1">
                          <h4 className="text-[10.5px] min-[380px]:text-[11.5px] font-bold leading-[1.25] text-[#25232A] line-clamp-2 h-[26px] min-[380px]:h-[29px] overflow-hidden">
                            {title}
                          </h4>

                          {/* Price Row */}
                          <div className="mt-1 flex items-baseline justify-between border-t border-[#F7F7F5] pt-1">
                            <span className="text-[11.5px] min-[380px]:text-[12.5px] font-black text-[#25232A] tracking-tight">
                              ₹{price}
                            </span>
                           
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

        {/* VALUE COMBO PACKAGES (Shared for Mobile & Desktop - Preserved) */}
        <section aria-label="Combo Packages" className="pt-2">
          <ValueComboPackages />
        </section>

        {/* DESKTOP-ONLY ABOUT SECTIONS (Preserved) */}
        <div className="hidden lg:block pt-6">
          <AboutSections />
        </div>
      </main>

      {/* ================= MINIMUM CART ERROR BAR (Preserved) ================= */}
      {minCartError && (
        <div className="fixed bottom-18 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm rounded-2xl bg-white/95 border border-[#EAE7E9] p-3 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300">
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
              className="rounded-lg bg-[#C2306B] px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-xs cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* ================= 8. PROFESSIONAL SERVICE DETAIL & BOOKING POPUP ================= */}
      <AnimatePresence>
        {selectedService && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Dialog: Slide-up Bottom Sheet on Mobile, Centered Modal on Desktop */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[101] max-h-[88vh] bg-white rounded-t-[28px] shadow-[0_-12px_40px_rgba(37,35,42,0.2)] flex flex-col overflow-hidden lg:top-1/2 lg:bottom-auto lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:max-w-xl lg:w-full lg:rounded-[28px] lg:max-h-[85vh]"
            >
              {/* Mobile Pull Handle */}
              <div className="w-12 h-1.5 rounded-full bg-[#EAE7E9] mx-auto mt-2.5 mb-1.5 lg:hidden shrink-0" />

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-1 pb-4 space-y-4 scrollbar-none">
                {/* Banner Image with Close Button and Badges */}
                <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-[#FAF7F8] border border-[#EAE7E9]">
                  <Image
                    src={getServiceImage(selectedService)}
                    alt={selectedService.name || selectedService.title}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    aria-label="Close modal"
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#25232A] shadow-md border border-[#EAE7E9] active:scale-95 transition-transform cursor-pointer"
                  >
                    <X size={16} />
                  </button>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black text-[#C2306B] uppercase tracking-wider shadow-sm border border-[#EAE7E9]">
                      {selectedService.category || "Woman Services"}
                    </span>
                    {selectedService.rating && (
                      <span className="flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-black text-[#25232A] shadow-sm border border-[#EAE7E9]">
                        <Star size={11} fill="#F59E0B" className="text-amber-500" />
                        <span>{selectedService.rating}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Price Header */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#25232A] tracking-tight leading-tight">
                      {selectedService.name || selectedService.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#77717A]">
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <ShieldCheck size={14} /> Background Verified
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#C2306B] font-bold">
                        <Sparkles size={14} /> Single-Use Kits
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl sm:text-2xl font-black text-[#25232A]">
                      ₹{selectedService.price}
                    </span>
                    <p className="text-[10px] font-semibold text-[#77717A] uppercase tracking-wider">
                      Taxes included
                    </p>
                  </div>
                </div>

                {/* Service Overview Description */}
                <div className="rounded-2xl bg-[#F7F7F5] p-3.5 border border-[#EAE7E9]/70">
                  <h4 className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#77717A] mb-1">
                    Service Description
                  </h4>
                  <p className="text-xs sm:text-sm text-[#25232A] leading-relaxed">
                    {selectedService.description ||
                      "Enjoy premium salon & home beauty treatments by verified specialists with single-use hygienic kits and sanitized tools."}
                  </p>
                </div>

                {/* What's Included / Service Steps from MongoDB */}
                {selectedService.steps && selectedService.steps.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#25232A] flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-[#C2306B]" />
                      <span>What's Included & Steps</span>
                    </h4>
                    <div className="space-y-1.5 pt-0.5">
                      {selectedService.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-[#EAE7E9]"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FCF1F5] text-[10px] font-black text-[#C2306B]">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-[#25232A] font-medium leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hygiene & Sparky Promise Pills */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-[#FCF1F5] border border-[#F9E3EC] text-center">
                    <Sparkles size={16} className="mx-auto text-[#C2306B] mb-1" />
                    <span className="block text-[10px] font-bold text-[#25232A] leading-tight">
                      Single-Use Kits
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#EEF5F7] border border-[#EAE7E9] text-center">
                    <ShieldCheck size={16} className="mx-auto text-[#094B66] mb-1" />
                    <span className="block text-[10px] font-bold text-[#25232A] leading-tight">
                      100% Sanitized
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F7F0EB] border border-[#EAE7E9] text-center">
                    <CheckCircle2 size={16} className="mx-auto text-[#55210A] mb-1" />
                    <span className="block text-[10px] font-bold text-[#25232A] leading-tight">
                      Mess-Free Finish
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Area */}
              <div className="border-t border-[#EAE7E9] bg-white p-3.5 sm:p-4 pb-6 flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#77717A]">
                    Total Price
                  </span>
                  <span className="text-xl font-black text-[#25232A]">
                    ₹{selectedService.price * (getCartQuantity(selectedService) || 1)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getCartQuantity(selectedService) > 0 ? (
                    <div className="flex items-center rounded-xl border border-[#C2306B] bg-[#FCF1F5] p-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(selectedService, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#C2306B] font-bold shadow-xs active:scale-90 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-xs font-black text-[#C2306B]">
                        {getCartQuantity(selectedService)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(selectedService, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#C2306B] font-bold shadow-xs active:scale-90 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(null, selectedService)}
                      className="px-4 py-3 rounded-xl border border-[#C2306B] bg-white text-xs font-black uppercase tracking-wider text-[#C2306B] hover:bg-[#FCF1F5] active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      Add to Bag
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleBookNow(selectedService)}
                    className="px-5 py-3 rounded-xl bg-[#C2306B] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md hover:bg-[#A82058] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Book Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}