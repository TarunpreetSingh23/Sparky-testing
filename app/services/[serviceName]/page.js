"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Clock,
  Star,
  Zap,
  ChevronRight,
  ShieldAlert,
  ChevronLeft,
  Share2,
  CheckCircle2,
  Trash2,
  X
} from "lucide-react";

export default function ServiceDetailPage() {
  const { serviceName } = useParams();
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [minCartError, setMinCartError] = useState("");

  const MIN_CART_VALUE = 299;
  
  // Theme Colors (Updated to Pink Theme matching your aesthetic)
  const PINK_PRIMARY = "#C2306B";
  const PINK_SECONDARY = "#A51F56";
  const PINK_ACCENT = "#F3A7C5";
  const PINK_BG = "#FFF6FA";

  const normalize = (s) => s?.toLowerCase().replace(/[\s-]+/g, "") || "";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.services || [];
        setServices(list);
        const decoded = decodeURIComponent(serviceName || "");
        const found = list.find((s) => normalize(s.title).includes(normalize(decoded)));
        setSelected(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [serviceName]);

  useEffect(() => { window.scrollTo(0, 0); }, [serviceName]);

  const getCartTotal = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  };

  const addToCart = (service) => {
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

  if (loading) return <ServiceDetailSkeleton />;

  if (!selected) return <div className="p-10 text-center font-black text-[#C2306B]">Service not found</div>;

  return (
    <div className="min-h-screen bg-white flex justify-center">
  <div
    className="
      w-full
      max-w-[430px]
      min-h-screen
      bg-[#FFF6FA]
      text-[#2B1B2E]
      pb-32
      font-sans
      relative
      overflow-hidden
      shadow-[0_0_60px_rgba(194,48,107,0.08)]
      selection:bg-[#FCE6EF]
    "
  >
      
      {/* 📍 Header Overlay */}
     <header
  className="
    fixed
    top-0
    left-1/2
    -translate-x-1/2
    w-full
    max-w-[430px]
    z-[50]
    flex justify-between items-center
    px-4 py-4
  "
>
  <button
    onClick={() => router.back()}
    className="w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center border border-[#F3DCE6] active:scale-90 transition-all cursor-pointer"
  >
    <ChevronLeft size={22} className="text-[#C2306B]" />
  </button>

  <div className="flex gap-2">
    <button
      className="p-2 relative w-10 h-10 bg-white/90 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center border border-[#F3DCE6] active:scale-90 transition-all cursor-pointer"
      onClick={() => router.push("/cart")}
    >
      <ShoppingCart size={22} color={PINK_PRIMARY} />
    </button>
  </div>
</header>

      {/* 🖼️ Hero Visual with Arch Style */}
      <div className="relative w-full aspect-[4/3] max-h-[360px] overflow-hidden rounded-b-[2.5rem] shadow-[0_12px_40px_rgba(194,48,107,0.12)] bg-[#FCE6EF]">

  <Image
    src={selected.image}
    alt={selected.title}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 600px"
    quality={85}
    priority
  />

  {/* Soft Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

</div>

      <main className="space-y-4 px-4 mt-[-30px] relative z-10">
        
        {/* Card 1: Core Title & Pricing */}
    <section className="bg-white rounded-[1.8rem] px-6 py-7 border border-[#F3DCE6] shadow-[0_8px_24px_rgba(194,48,107,0.04)]">

  <div className="space-y-5">

    {/* Tag + Rating */}
    <div className="flex items-center justify-between">

      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C2306B]">
        Premium Service
      </span>

      <div className="flex items-center gap-1 text-[#FACC15]">
        <Star size={13} fill="currentColor" />
        <span className="text-[12px] font-bold text-[#2B1B2E]">
          {selected.rating || "4.9"}
        </span>
      </div>

    </div>

    {/* Title */}
    <h1 className="text-[22px] font-black text-[#2B1B2E] leading-snug tracking-tight">
      {selected.title}
    </h1>

    {/* Description */}
    <p className="text-[14px] text-[#684B5A] leading-relaxed">
      {selected.description}
    </p>

    {/* Price Row */}
    <div className="flex items-end justify-between pt-4 border-t border-[#F3DCE6]">

      <div className="flex items-baseline gap-3">
        <span className="text-[24px] font-black text-[#2B1B2E]">
          ₹{selected.price}
        </span>

        <span className="text-[13px] text-[#A38A97] line-through">
          ₹{selected.price + 300}
        </span>
      </div>

      <span className="text-[10px] font-extrabold uppercase tracking-wide text-white bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56] px-3 py-1 rounded-full shadow-md">
        Best Value
      </span>

    </div>

  </div>
</section>


        {/* Min Cart Toast */}
      {minCartError && (
  <div
    className="fixed bottom-19 left-1/2 -translate-x-1/2 z-[100]
    w-[90%] max-w-xs
    bg-white/95 backdrop-blur-xl
    border border-[#F3DCE6]
    shadow-[0_10px_40px_rgba(194,48,107,0.15)]
    rounded-2xl px-4 py-3
    flex items-center gap-3
    animate-in fade-in slide-in-from-bottom-4 duration-300"
  >
    {/* Gradient 3D Icon */}
    <div className="relative shrink-0">
      <div className="w-10 h-10 rounded-xl
        bg-gradient-to-br from-[#E98CB0] via-[#C2306B] to-[#A51F56]
        flex items-center justify-center
        text-white text-sm font-black
        shadow-md shadow-[#C2306B]/30"
      >
        ₹
      </div>
    </div>

    {/* Text */}
    <div className="flex-1">
      <p className="text-xs font-semibold text-[#2B1B2E] leading-tight">
         <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#E98CB0] via-[#C2306B] to-[#A51F56] font-extrabold">
          {minCartError}
        </span> more
      </p>
      <p className="text-[10px] text-[#684B5A] font-medium">
        to proceed to checkout
      </p>

      {/* Minimal Progress */}
      <div className="mt-2 h-[3px] w-full bg-[#F3DCE6] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-br from-[#E98CB0] via-[#C2306B] to-[#A51F56] transition-all duration-700 ease-out rounded-full"
          style={{ width: "70%" }} 
        />
      </div>
    </div>
  </div>
)}

        {/* ✨ SERVICE STEPS: Pink Theme Style */}
      {selected.steps && selected.steps.length > 0 && (
  <section className="mt-12 px-6">

    {/* Header */}
    <div className="mb-10">
      <p className="text-[11px] font-extrabold tracking-[0.25em] text-[#C2306B] uppercase mb-2">
        How It Works
      </p>

      <h2 className="text-[24px] font-black text-[#2B1B2E] tracking-tight">
        Service Journey
      </h2>
    </div>

    {/* Steps */}
    <div className="space-y-8 relative">

      {/* Vertical Line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-[#F3DCE6]" />

      {selected.steps.map((step, idx) => {
        const [stepLabel, rest] = step.split(" – ");
        const [title, desc] = rest ? rest.split(": ") : [rest, ""];

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            viewport={{ once: true }}
            className="relative pl-12"
          >

            {/* Step Dot */}
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full 
              bg-white border border-[#F3DCE6] 
              flex items-center justify-center
              text-[11px] font-black text-[#C2306B]
              shadow-sm
            ">
              {idx + 1}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-[16px] font-extrabold text-[#2B1B2E] leading-snug">
                {title}
              </h3>

              <p className="text-[14px] text-[#684B5A] leading-relaxed">
                {desc}
              </p>
            </div>

          </motion.div>
        );
      })}
    </div>
  </section>
)}

        {/* Recommended: Pink Grid */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-[#F3DCE6] shadow-sm">
           <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#C2306B] mb-6">Popular Add-ons</h2>
           <div className="grid grid-cols-2 gap-4">
              {services.slice(0, 4).map((s, i) => (
                <div key={i} onClick={() => router.push(`/services/${encodeURIComponent(s.title)}`)} className="bg-[#FFF6FA] border border-[#F3DCE6] rounded-[2rem] p-3 shadow-sm active:scale-95 transition-all group cursor-pointer">
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-3">
                    <Image src={s.image} alt="Service" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <p className="text-[13px] font-black text-[#2B1B2E] line-clamp-1 uppercase mb-1 tracking-tight">{s.title}</p>
                  <p className="text-sm font-black text-[#C2306B]">₹{s.price}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Sparky Guarantee Badge */}
        <div className="p-12 text-center bg-gradient-to-br from-[#2B1B2E] via-[#3B223D] to-[#2B1B2E] rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="flex justify-center mb-4">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <ShieldCheck size={32} className="text-[#F3A7C5]" />
               </div>
            </div>
            <h4 className="text-white text-lg font-black tracking-widest uppercase italic">Sparky Certified</h4>
            <p className="text-white/70 text-[11px] font-extrabold uppercase tracking-widest mt-2 leading-relaxed px-4">
              Premium Hygiene • Single-Use Kits • Background Verified Experts
            </p>
        </div>
      </main>

      {/* 🚀 Sticky Checkout Bar */}
<div
  className="
    fixed
    bottom-0
    left-1/2
    -translate-x-1/2
    w-full
    max-w-[430px]
    z-60
    bg-white/90 backdrop-blur-xl
    border-t border-[#F3DCE6]
    px-6 py-4
    flex items-center justify-between
    shadow-[0_-12px_32px_rgba(194,48,107,0.08)]
    transition-all
  "
>

  {/* LEFT — Price */}
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      <span className="text-[24px] md:text-[26px] font-black text-[#2B1B2E] tracking-tight leading-none">
        ₹{selected.price}
      </span>

      <span className="
        bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56] 
        text-white
        text-[9px] font-extrabold px-2 py-0.5 
        rounded-full uppercase tracking-wide
        shadow-[0_2px_8px_rgba(194,48,107,0.25)]
      ">
        Net Price
      </span>
    </div>

    <p className="mt-1 text-[10px] font-semibold text-[#8D788D] tracking-wide">
      Excluding visiting charges
    </p>
  </div>

  {/* RIGHT — CTA */}
  <button
    onClick={() => addToCart(selected)}
    className="
      h-12 md:h-14 px-6 md:px-8 
      rounded-[1.5rem] 
      bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56]
      text-white 
      text-[12px] font-black uppercase tracking-[0.18em]
      shadow-[0_6px_18px_rgba(194,48,107,0.3)]
      flex items-center justify-center gap-3
      active:scale-[0.97] transition-all cursor-pointer
    "
  >
    Book Now
    <ChevronRight size={18} className="text-white" />
  </button>
</div>


    </div>
    </div>
  );
}

/* ================= LOADER ================= */
function ServiceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF6FA] pb-32 animate-pulse">

      {/* ===== HEADER FLOATING BUTTONS ===== */}
      <div className="fixed top-0 inset-x-0 z-[50] flex justify-between items-center px-4 py-4">
        <div className="w-10 h-10 rounded-full bg-white shadow border border-[#F3DCE6]" />
        <div className="w-10 h-10 rounded-full bg-white shadow border border-[#F3DCE6]" />
      </div>

      {/* ===== HERO IMAGE ===== */}
      <div className="relative w-full h-[420px] rounded-b-[3.5rem] overflow-hidden bg-[#FCE6EF]">
        <div className="absolute bottom-10 left-6 h-8 w-44 rounded-xl bg-white/80" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="space-y-4 px-4 mt-[-40px] relative z-10">

        {/* TITLE + PRICE CARD */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-[#F3DCE6] shadow-sm space-y-4">
          <div className="flex gap-3">
            <div className="h-6 w-32 rounded-full bg-[#FCE6EF]" />
            <div className="h-6 w-20 rounded-full bg-[#FCE6EF]" />
          </div>

          <div className="h-7 w-3/4 rounded-xl bg-[#F3DCE6]" />
          <div className="h-4 w-full rounded-lg bg-[#FCE6EF]" />
          <div className="h-4 w-2/3 rounded-lg bg-[#FCE6EF]" />

          <div className="flex items-center gap-4 pt-4 border-t border-[#F3DCE6]">
            <div className="h-8 w-24 rounded-xl bg-[#F3DCE6]" />
            <div className="h-6 w-16 rounded-lg bg-[#FCE6EF]" />
            <div className="ml-auto h-7 w-24 rounded-xl bg-[#FCE6EF]" />
          </div>
        </section>

        {/* SERVICE STEPS */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-[#F3DCE6] space-y-6">
          <div className="h-6 w-48 rounded-xl bg-[#F3DCE6]" />

          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#FFF6FA] p-6 rounded-[2rem] border border-[#F3DCE6] space-y-3"
            >
              <div className="flex justify-between">
                <div className="h-3 w-24 rounded bg-[#FCE6EF]" />
                <div className="h-8 w-8 rounded-lg bg-[#F3DCE6]" />
              </div>
              <div className="h-5 w-2/3 rounded bg-[#F3DCE6]" />
              <div className="h-4 w-full rounded bg-[#FCE6EF]" />
              <div className="h-4 w-3/4 rounded bg-[#FCE6EF]" />
            </div>
          ))}
        </section>

        {/* ADD-ONS GRID */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-[#F3DCE6]">
          <div className="h-4 w-32 rounded bg-[#F3DCE6] mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square rounded-[1.5rem] bg-[#FCE6EF]" />
                <div className="h-4 w-3/4 rounded bg-[#F3DCE6]" />
                <div className="h-4 w-16 rounded bg-[#FCE6EF]" />
              </div>
            ))}
          </div>
        </section>

        {/* GUARANTEE BANNER */}
        <div className="h-44 rounded-[3rem] bg-[#C2306B]/20" />
      </main>

      {/* ===== STICKY BOTTOM BAR ===== */}
      <div className="fixed bottom-0 inset-x-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-[#F3DCE6] px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-24 rounded bg-[#F3DCE6]" />
            <div className="h-3 w-32 rounded bg-[#FCE6EF]" />
          </div>
          <div className="h-14 w-40 rounded-[1.25rem] bg-[#C2306B]/30" />
        </div>
      </div>
    </div>
  );
}