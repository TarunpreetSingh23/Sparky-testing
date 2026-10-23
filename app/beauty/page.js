"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  X,
  ShoppingCart,
  Trash2,
  Star,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Filter,
  ArrowRight,
  Plus
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function CleaningPage() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category")?.toUpperCase() || "ALL";

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [minCartError, setMinCartError] = useState("");
  const router = useRouter();

  const MIN_CART_VALUE = 299;

  // Theme Colors
  const SAGA_GREEN = "#C2306B";
  const SAGA_SOFT = "#FCEAF1";
  const SAGA_ACCENT = "#f7b614";
  const SAGA_MAROON = "#C2306B";

  const CATEGORY_LIST = [
    "ALL",
    "FACIAL",
    "CLEANUP",
    "WAXING",
    "MAKEUP",
    "MANICURE",
    "BLEACH",
    "THREADING",
    "HAIR",
  ];

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  useEffect(() => {
    const cat = searchParams.get("category")?.toUpperCase();
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("ALL");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/facial");
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const addToCart = (service) => {
    const itemToAdd = {
      title: service.name || service.title,
      price:
        typeof service.price === "string"
          ? parseInt(service.price.replace("₹", ""))
          : service.price,
      image: service.image,
      quantity: 1,
      category: service.category,
      earning: service.earning,
      profit: service.profit,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, itemToAdd];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);

    const total = updatedCart.reduce((sum, i) => sum + i.price, 0);

    if (total < MIN_CART_VALUE) {
      const remaining = MIN_CART_VALUE - total;
      setMinCartError(`Add at least ₹${remaining} service`);
      return;
    }

    setMinCartError("");
  };

  const isItemInCart = (title) => {
    return cart.some((i) => i.title?.toLowerCase() === title?.toLowerCase());
  };

  const filteredServices =
    selectedCategory === "ALL"
      ? services
      : services.filter((s) =>
          (s.title || "").toLowerCase().includes(selectedCategory.toLowerCase())
        );

  if (loading) return <CleaningSkeleton />;

  return (
    <div className="min-h-screen bg-[#FFF7F3] text-[#2B1B2E] font-sans antialiased pb-28 lg:pb-16 selection:bg-[#F1DFE8]">
      {/* =========================================================================
          1. PROFESSIONAL LANDSCAPE / RESPONSIVE STICKY HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#F1DFE8] shadow-[0_4px_20px_rgba(58,77,57,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Back button + Title / Breadcrumb */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.back()}
              className="btn-icon w-10 h-10 text-[#C2306B]"
              aria-label="Go Back"
            >
              <ChevronLeft size={20} />
            </button>

            <div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#8D788D] opacity-80">
                <span>Sparky Services</span>
                <span>/</span>
                <span className="text-[#C2306B] font-extrabold">Rituals</span>
              </div>
              <h1 className="text-lg lg:text-2xl font-[900] tracking-tight text-[#2B1B2E] flex items-center gap-2">
                <span>{selectedCategory === "ALL" ? "All Services" : `${selectedCategory}`}</span>
                {/* <span className="text-xs font-semibold text-[#8D788D] bg-[#F1DFE8] px-2.5 py-0.5 rounded-full">
                  {filteredServices.length} available
                </span> */}
              </h1>
            </div>
          </div>

          {/* Right: Cart Button + Live Preview */}
          <div className="flex items-center gap-3">
            {/* Desktop Quick Cart Badge Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="btn-secondary-pill px-4 py-2 flex items-center gap-2.5"
            >
              <div className="relative">
                <ShoppingCart size={19} color={SAGA_GREEN} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C2306B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold border-2 border-white shadow-sm">
                    {cart.length}
                  </span>
                )}
              </div>

              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-[#8D788D] font-semibold">Your Bag</span>
                <span className="text-xs font-black text-[#2B1B2E]">
                  ₹{cartTotal}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile-Only Horizontal Category Pills */}
     <div className="lg:hidden w-full overflow-hidden bg-white/90">
  <div
    className="flex w-full items-center gap-2.5 overflow-x-auto overscroll-x-contain px-4 py-3 scroll-smooth no-scrollbar"
    style={{
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
    }}
  >
    {CATEGORY_LIST.map((cat) => {
      const isActive = selectedCategory === cat;

      return (
        <button
          key={cat}
          type="button"
          onClick={() => setSelectedCategory(cat)}
          className={`
            relative flex h-[42px] shrink-0 items-center justify-center
            rounded-full px-6 py-2
            text-xs font-black uppercase tracking-wider
            whitespace-nowrap leading-none
            transition-all duration-300 active:scale-95 cursor-pointer
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#C2306B]/40
            ${
              isActive
                ? "bg-[#2B1B2E] text-white shadow-[0_4px_14px_rgba(43,27,46,0.2)] border border-transparent"
                : "bg-white text-[#2B1B2E] border border-[#F3DCE6] shadow-[0_2px_8px_rgba(194,48,107,0.04)] hover:border-[#E98CB0] hover:bg-[#FFF9FB]"
            }
          `}
        >
          <span className="relative z-10">{cat}</span>
        </button>
      );
    })}
  </div>
</div>
      </header>

      {/* =========================================================================
          2. MAIN LANDSCAPE LAYOUT (Laptop 2-Column Grid vs Mobile Vertical)
          ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* -------------------------------------------------------------
              LEFT COLUMN: DESKTOP STICKY SIDEBAR (Hidden on mobile)
              ------------------------------------------------------------- */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-24 space-y-6">
            {/* Category Navigator Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#F1DFE8] shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F1DFE8]">
                <Filter size={16} className="text-[#C2306B]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#C2306B]">
                  Filter Rituals
                </h3>
              </div>

              <div className="space-y-1.5">
                {CATEGORY_LIST.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 text-left ${
                        isActive
                          ? "btn-primary text-white shadow-md shadow-[#C2306B]/20"
                          : "text-[#8D788D] hover:bg-[#FFF7F3] hover:text-[#2B1B2E]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full transition-all ${
                            isActive ? "bg-white scale-125" : "bg-[#F1DFE8]"
                          }`}
                        />
                        <span>{cat}</span>
                      </div>

                      {isActive && <ChevronRight size={14} className="opacity-80" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sparky Trust & Quality Assurance Badge */}
            <div className="bg-gradient-to-br from-[#FFF7F3] to-[#F1DFE8] rounded-3xl p-5 border border-[#F1DFE8] space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#C2306B]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#C2306B]">
                  Sparky Assured
                </span>
              </div>
              <ul className="text-[11px] text-[#8D788D] space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#C2306B] shrink-0" />
                  <span>100% Certified Salon Specialists</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#C2306B] shrink-0" />
                  <span>Hygienic Single-Use Sealed Kits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#C2306B] shrink-0" />
                  <span>Transparent Upfront Pricing</span>
                </li>
              </ul>
            </div>

            {/* Desktop Sticky Bag Quick Widget */}
            {cart.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-[#F1DFE8] shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#2B1B2E]">
                    Quick Bag ({cart.length})
                  </span>
                  <span className="text-sm font-black text-[#C2306B]">
                    ₹{cartTotal}
                  </span>
                </div>
                <button
                  onClick={() => setCartOpen(true)}
                  className="btn-primary w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span>Review Bag</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </aside>

          {/* -------------------------------------------------------------
              RIGHT COLUMN: SERVICE SHOWCASE GRID (Landscape 2/3 cols on laptop)
              ------------------------------------------------------------- */}
          <div className="lg:col-span-9 xl:col-span-9 space-y-6">
            {/* Desktop Category Banner Header */}
            <div className="hidden lg:flex items-center justify-between pb-2 border-b border-[#F1DFE8]">
              <div>
                <h2 className="text-xl font-[900] text-[#2B1B2E]">
                  {selectedCategory === "ALL" ? "All Available Rituals" : `${selectedCategory} Rituals`}
                </h2>
                <p className="text-xs text-[#8D788D] mt-0.5">
                  Showing curated beauty treatments with transparent pricing & premium ingredients.
                </p>
              </div>
              <div className="text-xs font-bold text-[#8D788D] bg-white border border-[#F1DFE8] px-3.5 py-1.5 rounded-full shadow-sm">
                {filteredServices.length} services found
              </div>
            </div>

            {/* Grid Container: 1 col on mobile, 2 cols on tablet/laptop, 3 cols on xl wide screens */}
            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#F1DFE8] shadow-sm">
                <Sparkles size={36} className="mx-auto text-[#8D788D] mb-3 opacity-60" />
                <h3 className="text-base font-extrabold text-[#2B1B2E]">No rituals found</h3>
                <p className="text-xs text-[#8D788D] mt-1">
                  Try selecting another category or check back soon for new services.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredServices.map((service) => {
                  const inCart = isItemInCart(service.title || service.name);
                  return (
                    <div
                      key={service._id || service.title}
                      className="group bg-white rounded-3xl p-5 border border-[#F1DFE8] shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#F1DFE8] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top: Rating + Category Tag */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#F7B614] bg-[#FFF9E6] px-2 py-0.5 rounded-full">
                            <Star size={11} fill="currentColor" />
                            <span>{service.rating || "4.8"}</span>
                          </div>

                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D788D] bg-[#FCEAF1] px-2.5 py-0.5 rounded-full">
                            {service.category || "Beauty"}
                          </span>
                        </div>

                        {/* Title & Short Description */}
                        <h3 className="text-base font-extrabold text-[#2B1B2E] leading-snug tracking-tight mb-1.5 group-hover:text-[#C2306B] transition-colors">
                          {service.title}
                        </h3>

                        <p className="text-[12px] text-[#8D788D] leading-relaxed mb-4 line-clamp-2">
                          {service.description || "Deluxe skincare session with natural herbal extracts and soothing massage."}
                        </p>
                      </div>

                      {/* Bottom Layout: Image + Price + Add Button */}
                      <div className="pt-3 border-t border-[#FCEAF1] flex items-center justify-between gap-3">
                        {/* Price & View Details Link */}
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-[900] text-[#2B1B2E]">
                              ₹{service.price}
                            </span>
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{parseInt(service.price) + 300}
                            </span>
                          </div>

                          <button
                            onClick={() => router.push(`services/${service.title}`)}
                            className="text-[11px] font-bold text-[#C2306B] flex items-center gap-0.5 hover:gap-1.5 transition-all mt-1"
                          >
                            <span>View Details</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>

                        {/* Image Thumbnail with Overlay Add Button */}
                        <div className="relative flex flex-col items-center shrink-0">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#FCEAF1] border border-[#F1DFE8] shadow-inner">
                            <Image
                              src={service.image || "/images/goldfacial.jpg"}
                              alt={service.title}
                              fill
                              className="object-cover group-hover:scale-105 transition duration-500"
                            />
                          </div>

                          <button
                            onClick={() => addToCart(service)}
                            className={`absolute -bottom-2.5 px-4 py-1.5 text-[11px] font-bold shadow-md transition-all active:scale-95 ${
                              inCart
                                ? "btn-primary rounded-xl"
                                : "btn-secondary rounded-xl"
                            }`}
                          >
                            {inCart ? "Added ✓" : "Add +"}
                          </button>
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
          3. FLOATING CART BAR FOR MOBILE (Hidden on desktop sidebar mode)
          ========================================================================= */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 lg:hidden">
          <div className="max-w-md mx-auto">
            <div
              onClick={() => setCartOpen(true)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-[#C2306B] via-[#A82058] to-[#A82058] text-white shadow-xl shadow-[#C2306B]/30 active:scale-[0.98] transition-all border border-white/10 backdrop-blur-xl cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F7B614] flex items-center justify-center text-[#2B1B2E] shadow-md">
                  <ShoppingCart size={16} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-extrabold">₹{cartTotal}</span>
                  <span className="text-[10px] text-white/70">
                    {cart.length} service{cart.length > 1 ? "s" : ""} added
                  </span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 text-xs font-bold tracking-wide flex items-center gap-1">
                <span>View Bag</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. RESPONSIVE CART DRAWER (Right Slide-over on Laptop, Bottom Sheet on Mobile)
          ========================================================================= */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          cartOpen
            ? "bg-black/60 backdrop-blur-sm opacity-100 visible"
            : "bg-black/0 opacity-0 invisible"
        }`}
        onClick={() => setCartOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            fixed transition-transform duration-500 ease-out bg-white shadow-2xl flex flex-col
            /* Mobile Style: Bottom Sheet */
            bottom-0 left-0 right-0 max-h-[85vh] rounded-t-[2.5rem] p-6 border-t border-[#F1DFE8]
            /* Laptop Style: Right Slide-over Sidebar */
            lg:top-0 lg:bottom-0 lg:left-auto lg:right-0 lg:w-[460px] lg:max-h-full lg:rounded-l-[2rem] lg:rounded-tr-none lg:border-l lg:border-t-0 lg:p-8
            ${cartOpen ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-y-0 lg:translate-x-full"}
          `}
        >
          {/* Mobile Handle (hidden on laptop) */}
          <div className="w-12 h-1 bg-[#F1DFE8] rounded-full mx-auto mb-4 lg:hidden" />

          {/* Drawer Header */}
          <div className="flex justify-between items-center pb-4 border-b border-[#F1DFE8] mb-4">
            <div>
              <h2 className="text-2xl font-[1000] italic text-[#2B1B2E]">
                My <span className="text-[#C2306B]">Bag</span>
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D788D]">
                {cart.length} Ritual{cart.length > 1 ? "s" : ""} Selected
              </span>
            </div>

            <button
              onClick={() => setCartOpen(false)}
              className="btn-icon w-9 h-9 text-[#C2306B]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-1 py-2">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-[#8D788D]">
                <ShoppingCart size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold">Your bag is empty</p>
                <p className="text-xs opacity-75 mt-0.5">Add treatments to proceed</p>
              </div>
            ) : (
              cart.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF7F3] border border-[#F1DFE8] hover:border-[#F1DFE8] transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#F1DFE8] shrink-0">
                      <Image
                        src={item.image || "/images/goldfacial.jpg"}
                        fill
                        className="object-cover"
                        alt={item.title || "service"}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#2B1B2E] truncate">
                        {item.title}
                      </p>
                      <p className="text-[#C2306B] font-black text-xs mt-0.5">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = cart.filter((_, idx) => idx !== i);
                      setCart(updated);
                      localStorage.setItem("cart", JSON.stringify(updated));
                    }}
                    className="btn-icon w-8 h-8 text-[#C2306B] hover:text-red-600 hover:bg-rose-50"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-[#F1DFE8] space-y-4 mt-auto">
              <div className="flex justify-between items-end px-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D788D]">
                    Total Payable
                  </span>
                  <p className="text-[11px] text-[#8D788D]">Taxes and single-use kit included</p>
                </div>
                <span className="text-2xl font-[1000] text-[#2B1B2E]">
                  ₹{cartTotal}
                </span>
              </div>

              <button
                onClick={() => {
                  if (cartTotal < MIN_CART_VALUE) {
                    setMinCartError(
                      `Add ₹${MIN_CART_VALUE - cartTotal} more to book`
                    );
                    return;
                  }
                  router.push("/checkout");
                }}
                className="btn-primary w-full py-3.5 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          5. MIN-CART TOAST WARNING
          ========================================================================= */}
      {minCartError && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[110] w-[90%] max-w-sm bg-white/95 backdrop-blur-2xl border border-[#F1DFE8] shadow-2xl rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF9E6] text-[#F7B614] flex items-center justify-center font-black text-sm shrink-0 border border-[#F7B614]/20">
            ₹
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#2B1B2E] truncate">
              {minCartError}
            </p>
            <p className="text-[10px] text-[#8D788D]">
              Minimum order value is ₹{MIN_CART_VALUE}
            </p>
          </div>
          <button
            onClick={() => setMinCartError("")}
            className="text-gray-400 hover:text-gray-600 p-1"
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

// --- Skeleton Loader matching the new Landscape structure ---
function CleaningSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF7F3] p-4 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-16 bg-white rounded-2xl border border-[#F1DFE8]" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="hidden lg:block lg:col-span-3 h-96 bg-white rounded-3xl border border-[#F1DFE8]" />
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-3xl border border-[#F1DFE8]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
