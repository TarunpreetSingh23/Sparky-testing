"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Share2,
  Star,
  Clock,
  ShieldCheck,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

export default function ServiceDetailPage() {
  const { serviceName } = useParams();
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [minCartError, setMinCartError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const MIN_CART_VALUE = 299;

  const normalize = (s) => s?.toLowerCase().replace(/[\s-]+/g, "") || "";

  // Fetch Services from API and find matched service
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.services || [];
        setServices(list);

        const decoded = decodeURIComponent(serviceName || "");
        const found = list.find((s) =>
          normalize(s.title || s.name).includes(normalize(decoded))
        );
        setSelected(found || list[0] || null);
      } catch (err) {
        console.error("Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [serviceName]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceName]);

  // Sync existing quantity from cart if already present
  useEffect(() => {
    if (!selected) return;
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const matched = cart.find(
        (item) => item.title === (selected.title || selected.name)
      );
      if (matched && matched.quantity) {
        setQuantity(matched.quantity);
      }
    } catch (e) {
      // ignore
    }
  }, [selected]);

  const getCartTotal = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const handleQuantityChange = (delta) => {
    const newQty = Math.max(1, quantity + delta);
    setQuantity(newQty);

    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const title = selected.title || selected.name;
      const index = cart.findIndex((item) => item.title === title);
      if (index > -1) {
        cart[index].quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("sparky-cart-change"));
      }
    } catch (e) {
      // ignore
    }
  };

  const addToCart = (service) => {
    if (!service) return;

    const itemToAdd = {
      title: service.name || service.title,
      price:
        typeof service.price === "string"
          ? parseInt(service.price.replace(/[₹,\s]/g, ""), 10)
          : service.price,
      image: service.image || service.imageUrl || "/images/goldfacial.webp",
      quantity: quantity || 1,
      category: service.category || "Woman Services",
      earning: service.earning || 0,
      profit: service.profit || 0,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = existingCart.findIndex(
      (item) => item.title === itemToAdd.title
    );

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity = quantity;
    } else {
      existingCart.push(itemToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("sparky-cart-change"));

    toast.success("Added to cart!");

    const total = getCartTotal();
    if (total < MIN_CART_VALUE) {
      const remaining = MIN_CART_VALUE - total;
      setMinCartError(`Add at least ₹${remaining} more service`);
      return;
    }

    setMinCartError("");
    router.push("/cart");
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: selected?.title || "Sparky Home Services",
          text: `Check out ${selected?.title} on Sparky!`,
          url: window.location.href,
        });
      } catch (err) {
        // user dismissed share sheet
      }
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return <ServiceDetailSkeleton />;

  if (!selected) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#25232A] mb-2">Service not found</h2>
        <p className="text-sm text-[#77717A] mb-6">
          The service you are looking for is unavailable or has been relocated.
        </p>
        <button
          onClick={() => router.push("/beauty")}
          className="px-6 py-2.5 rounded-xl bg-[#C2306B] text-white text-xs font-bold uppercase tracking-wider"
        >
          Explore All Services
        </button>
      </div>
    );
  }

  const price =
    typeof selected.price === "string"
      ? parseInt(selected.price.replace(/[₹,\s]/g, ""), 10)
      : selected.price;
  const originalPrice = selected.originalPrice || Math.round(price * 1.25);
  const reviewsList = Array.isArray(selected.reviews) ? selected.reviews : [];

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#25232A] pb-32">
      {/* Container - Mobile centered with desktop max-width constraints */}
      <div className="w-full max-w-lg lg:max-w-4xl mx-auto bg-white min-h-screen shadow-[0_2px_16px_rgba(37,35,42,0.04)] lg:my-6 lg:rounded-[28px] lg:border lg:border-[#EAE7E9] overflow-hidden">
        
        {/* ================= A. SERVICE IMAGE GALLERY ================= */}
        <div className="relative w-full aspect-[4/3] max-h-[340px] sm:max-h-[380px] bg-[#F7F7F5] overflow-hidden">
          <Image
            src={selected.image || "/images/goldfacial.webp"}
            alt={selected.title || selected.name}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            priority
            className="object-cover object-center"
          />

          {/* Top Edge Protection Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/10 pointer-events-none" />

          {/* Top Bar Floating Controls */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pt-safe">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-[#25232A] shadow-md border border-[#EAE7E9] active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            {/* Actions: Share & Cart */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share service"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-[#25232A] shadow-md border border-[#EAE7E9] active:scale-95 transition-transform cursor-pointer"
              >
                <Share2 size={17} />
              </button>

              <button
                type="button"
                onClick={() => router.push("/cart")}
                aria-label="View cart"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-[#25232A] shadow-md border border-[#EAE7E9] active:scale-95 transition-transform cursor-pointer"
              >
                <ShoppingCart size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* ================= B. SERVICE NAME, PRICE & QUANTITY ROW ================= */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              {/* Title & Category */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C2306B]">
                  {selected.category || "Professional Home Service"}
                </span>
                <h1 className="mt-0.5 text-xl sm:text-2xl font-black text-[#25232A] leading-tight tracking-tight">
                  {selected.title || selected.name}
                </h1>
              </div>

              {/* Price Block */}
              <div className="text-right shrink-0">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#25232A] tracking-tight">
                    ₹{price}
                  </span>
                  {originalPrice > price && (
                    <span className="text-xs font-semibold text-[#77717A] line-through">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-[#77717A] uppercase tracking-wider">
                  Inclusive of all taxes
                </p>
              </div>
            </div>

            {/* Compact Quantity Selector */}
            <div className="flex items-center justify-between pt-2 border-t border-[#EAE7E9]">
              <span className="text-xs font-bold text-[#77717A]">
                Quantity
              </span>
              <div className="inline-flex items-center rounded-xl border border-[#EAE7E9] bg-[#F7F7F5] p-1">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#25232A] shadow-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-transform"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>
                <span className="w-8 text-center text-xs font-black text-[#25232A]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  aria-label="Increase quantity"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#25232A] shadow-xs active:scale-90 transition-transform"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* ================= E. SERVICE INFORMATION SUMMARY ================= */}
          <div className="grid grid-cols-3 divide-x divide-[#EAE7E9] rounded-2xl border border-[#EAE7E9] bg-[#F7F7F5] p-3 text-center">
            {/* 1. Rating */}
            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[#25232A]">
                <Star size={14} fill="#f59e0b" className="text-amber-500" />
                <span className="text-sm font-black">
                  {selected.rating || "4.8"}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] font-medium text-[#77717A]">
                Customer Rating
              </p>
            </div>

            {/* 2. Estimated Duration */}
            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[#25232A]">
                <Clock size={14} className="text-[#C2306B]" />
                <span className="text-sm font-black">45-60 min</span>
              </div>
              <p className="mt-0.5 text-[10px] font-medium text-[#77717A]">
                Service Time
              </p>
            </div>

            {/* 3. Hygiene Standard */}
            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[#25232A]">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="text-sm font-black">Verified</span>
              </div>
              <p className="mt-0.5 text-[10px] font-medium text-[#77717A]">
                Single-use kit
              </p>
            </div>
          </div>

          {/* ================= D. DESCRIPTION SECTION ================= */}
          <section className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#25232A]">
              About This Service
            </h2>
            <p className="text-sm text-[#77717A] leading-relaxed">
              {selected.description ||
                "Delivered at your home by background-verified professionals using sealed hygienic kits, sterilized tools, and salon-grade formulas."}
            </p>
          </section>

          {/* ================= G. SERVICE JOURNEY / STEPS (If Available) ================= */}
          {selected.steps && selected.steps.length > 0 && (
            <section className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-wider text-[#25232A]">
                  Service Process ({selected.steps.length} Steps)
                </h2>
                <span className="text-[10px] font-bold text-[#C2306B]">Standard Protocol</span>
              </div>

              <div className="space-y-2.5">
                {selected.steps.map((step, idx) => {
                  const [stepNumber, details] = step.split(" – ");
                  const [stepTitle, stepDesc] = details ? details.split(": ") : [details, ""];

                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-[#EAE7E9] bg-white p-3 shadow-xs"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFF0F6] text-[10px] font-black text-[#C2306B] border border-[#F1DFE8]">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#25232A]">
                          {stepTitle || step}
                        </h4>
                        {stepDesc && (
                          <p className="mt-0.5 text-[11px] text-[#77717A] leading-relaxed">
                            {stepDesc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ================= F. REVIEWS SECTION ================= */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-[#25232A]">
                  Customer Reviews
                </h2>
                {reviewsList.length > 0 && (
                  <span className="rounded-full bg-[#F7F7F5] px-2 py-0.5 text-[10px] font-bold text-[#77717A] border border-[#EAE7E9]">
                    {reviewsList.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-[#77717A]">Verified Bookings</span>
            </div>

            {reviewsList.length > 0 ? (
              <div className="space-y-2.5">
                {reviewsList.map((review, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#EAE7E9] bg-[#F7F7F5] p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#25232A]">
                        {review.user?.name || review.userName || "Verified Customer"}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: review.rating || 5 }).map((_, rIdx) => (
                          <Star key={rIdx} size={11} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#77717A] leading-relaxed">
                      {review.comment || review.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-[#EAE7E9] bg-[#F7F7F5] p-5 text-center">
                <MessageSquare size={20} className="mx-auto text-[#77717A] mb-1.5" />
                <p className="text-xs font-bold text-[#25232A]">No reviews yet</p>
                <p className="text-[11px] text-[#77717A] mt-0.5">
                  Book this service and share your verified experience!
                </p>
              </div>
            )}
          </section>

          {/* ================= H. RECOMMENDED ADD-ONS ================= */}
          {services.length > 1 && (
            <section className="space-y-3 pt-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#25232A]">
                Frequently Booked Together
              </h2>

              <div className="grid grid-cols-2 gap-2.5">
                {services
                  .filter((s) => (s.title || s.name) !== (selected.title || selected.name))
                  .slice(0, 4)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        router.push(
                          `/services/${encodeURIComponent(item.title || item.name)}`
                        )
                      }
                      className="rounded-xl border border-[#EAE7E9] bg-white p-2.5 shadow-xs cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#F7F7F5] mb-2">
                        <Image
                          src={item.image || "/images/goldfacial.webp"}
                          alt={item.title || item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="text-[11px] font-bold text-[#25232A] line-clamp-1">
                        {item.title || item.name}
                      </h4>
                      <p className="mt-0.5 text-xs font-black text-[#C2306B]">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Minimum Cart Toast */}
          {minCartError && (
            <div className="rounded-xl border border-[#F1DFE8] bg-[#FFF0F6] p-3 text-center">
              <p className="text-xs font-bold text-[#C2306B]">
                {minCartError}
              </p>
              <p className="text-[10px] text-[#77717A] mt-0.5">
                Minimum booking total is ₹{MIN_CART_VALUE}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= G. FIXED BOTTOM BOOKING ACTION ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#EAE7E9] shadow-[0_-4px_16px_rgba(37,35,42,0.06)]">
        <div className="max-w-lg lg:max-w-4xl mx-auto px-4 py-3 pb-safe flex items-center justify-between gap-3">
          {/* Left Price Details */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#77717A] uppercase tracking-wider">
              Total ({quantity} {quantity === 1 ? "unit" : "units"})
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-[#25232A]">
                ₹{price * quantity}
              </span>
              {originalPrice > price && (
                <span className="text-xs font-medium text-[#77717A] line-through">
                  ₹{originalPrice * quantity}
                </span>
              )}
            </div>
          </div>

          {/* Right Action Button */}
          <button
            type="button"
            onClick={() => addToCart(selected)}
            className="flex-1 max-w-[240px] h-[48px] rounded-xl bg-[#C2306B] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-[#A82058] active:scale-95 transition-all cursor-pointer"
          >
            <span>Add to Cart</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= SKELETON LOADER ================= */
function ServiceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-28">
      <div className="w-full max-w-lg lg:max-w-4xl mx-auto bg-white min-h-screen p-4 space-y-4">
        {/* Hero image skeleton */}
        <div className="w-full aspect-[4/3] max-h-[340px] rounded-2xl bg-[#EAE7E9] animate-pulse" />

        {/* Title row */}
        <div className="space-y-2 pt-2">
          <div className="h-4 w-28 bg-[#EAE7E9] rounded animate-pulse" />
          <div className="h-7 w-3/4 bg-[#EAE7E9] rounded animate-pulse" />
          <div className="h-6 w-24 bg-[#EAE7E9] rounded animate-pulse" />
        </div>

        {/* 3 Metric columns */}
        <div className="h-16 w-full rounded-2xl bg-[#EAE7E9] animate-pulse" />

        {/* Description lines */}
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-[#EAE7E9] rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-[#EAE7E9] rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-[#EAE7E9] rounded animate-pulse" />
        </div>

        {/* Fixed bottom bar skeleton */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#EAE7E9]" />
      </div>
    </div>
  );
}