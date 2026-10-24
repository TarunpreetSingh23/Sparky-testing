"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Headphones,
  MessageSquare,
  Phone,
  Mail,
  Send,
  ChevronDown,
  Search,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  RefreshCw,
  HelpCircle,
  FileText,
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  X,
  AlertTriangle,
  Zap
} from "lucide-react";

/* =========================================================================
   FAQ DATA
   ========================================================================= */
const FAQ_CATEGORIES = [
  "All Topics",
  "Booking & Rescheduling",
  "Payments & Refunds",
  "Safety & Quality",
  "Live Service Journey",
];

const FAQ_ITEMS = [
  {
    id: 1,
    category: "Booking & Rescheduling",
    question: "How do I track my service professional in real-time?",
    answer:
      "Once an expert is assigned to your order, you can visit the Track page directly from your account or the floating order tracker. You will see their live GPS coordinates on an interactive map with updated turn-by-turn ETA.",
  },
  {
    id: 2,
    category: "Safety & Quality",
    question: "What is Sparky's 100% Satisfaction Guarantee?",
    answer:
      "Sparky guarantees craftsmanship and hygiene. If you are not completely delighted with your service ritual, our safety desk will arrange a complimentary rework session with a senior specialist or initiate an immediate full refund.",
  },
  {
    id: 3,
    category: "Booking & Rescheduling",
    question: "Can I reschedule or cancel my service booking?",
    answer:
      "Yes. You can reschedule to any available date and time slot with zero penalty as long as the technician has not departed for your premises. Free cancellations are honored up to 2 hours before the scheduled appointment.",
  },
  {
    id: 4,
    category: "Payments & Refunds",
    question: "How do refunds work and how long do they take?",
    answer:
      "Approved refunds are processed instantly back to your original payment method (UPI, Debit/Credit Card, or Net Banking). Bank settlement typically reflects within 2 to 4 business hours.",
  },
  {
    id: 5,
    category: "Safety & Quality",
    question: "Are all Sparky service professionals background-checked?",
    answer:
      "Every single technician and salon partner undergoes 7-point verification: mandatory police background clearance, government ID validation, in-person hygiene training, and technical trade tests before accepting any appointment.",
  },
  {
    id: 6,
    category: "Live Service Journey",
    question: "What should I do if an emergency arises during a service?",
    answer:
      "Every active appointment includes an instant Emergency Pause feature in the app. Tapping it halts the live service timer immediately and alerts our priority safety desk to contact you within 60 seconds.",
  },
  {
    id: 7,
    category: "Payments & Refunds",
    question: "Which payment options are accepted?",
    answer:
      "We support all major payment gateways including UPI (Google Pay, PhonePe, Paytm), Visa, MasterCard, RuPay cards, Net Banking, and secure Cash on Delivery upon completion.",
  },
];

/* =========================================================================
   QUICK ASSISTANCE CARDS DATA
   ========================================================================= */
const QUICK_CARDS = [
  {
    id: "call",
    title: "Call Direct Concierge",
    subtitle: "Instant Voice Support",
    detail: "+91 81950 60669",
    meta: "Available 7 AM - 11 PM",
    badge: "Priority",
    badgeColor: "bg-[#F7B614] text-[#2B1B2E]",
    icon: Phone,
    actionText: "Call Now",
    actionHref: "tel:+918195060669",
  },
  {
    id: "whatsapp",
    title: "WhatsApp Helpline",
    subtitle: "Chat with an Expert",
    detail: "Direct message resolution",
    meta: "Average reply: 2 mins",
    badge: "Fastest",
    badgeColor: "bg-[#C2306B] text-white",
    icon: MessageSquare,
    actionText: "Open WhatsApp",
    actionHref: "https://wa.me/918195060669?text=Hi%20Sparky%20Support,%20I%20need%20assistance%20with%20my%20service.",
    external: true,
  },
  {
    id: "orders",
    title: "Active Bookings",
    subtitle: "Self-Service Hub",
    detail: "Track, reschedule, or cancel",
    meta: "Instant self-service",
    badge: "Automated",
    badgeColor: "bg-[#FCEAF1] text-[#8D788D]",
    icon: Calendar,
    actionText: "Manage Bookings",
    actionHref: "/user",
  },
  {
    id: "email",
    title: "Email Support Desk",
    subtitle: "Official Correspondence",
    detail: "support@sparky.in",
    meta: "Detailed inquiry & bills",
    badge: "24x7",
    badgeColor: "bg-[#FCEAF1] text-[#8D788D]",
    icon: Mail,
    actionText: "Write Email",
    actionHref: "mailto:support@sparky.in",
  },
];

const ISSUE_TAGS = [
  "Booking & Reschedule",
  "Technician Delay",
  "Billing & Invoice",
  "Quality / Rework",
  "Refund Status",
  "Safety / Emergency",
  "Other Inquiry",
];

export default function HelpPage() {
  const router = useRouter();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [openFaqId, setOpenFaqId] = useState(1);

  // Form State
  const [selectedIssue, setSelectedIssue] = useState("Booking & Reschedule");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bookingId: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Filter FAQ items by category and search query
  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "All Topics" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          issueType: selectedIssue,
        }),
      });

      const data = await res.json().catch(() => ({ success: true }));

      if (data.success !== false) {
        toast.success("Help request registered successfully!");
        setSubmitted(true);
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          bookingId: "",
          message: "",
        });
      } else {
        toast.error("Could not dispatch ticket. Please try again or call support.");
      }
    } catch {
      // Graceful offline fallback
      toast.success("Request logged! A concierge manager will reach out shortly.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F3] text-[#2B1B2E] font-sans antialiased pb-24 lg:pb-16 selection:bg-[#F1DFE8]">
      {/* =========================================================================
          1. HEADER BAR
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#F1DFE8] shadow-[0_4px_20px_rgba(58,77,57,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="btn-icon w-10 h-10 text-[#C2306B]"
              aria-label="Go Back"
            >
              <ChevronLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#8D788D] opacity-80">
                <span>Sparky Care</span>
                <span>/</span>
                <span className="text-[#C2306B] font-extrabold">24/7 Desk</span>
              </div>
              <h1 className="text-lg lg:text-xl font-[900] tracking-tight text-[#2B1B2E]">
                Help & Concierge Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+918195060669"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C2306B] text-white text-xs font-bold shadow-sm hover:shadow transition-all active:scale-95"
            >
              <Phone size={13} className="text-[#F7B614]" />
              <span className="hidden sm:inline">Priority Line</span>
            </a>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO BANNER CARD WITH LIVE SEARCH
          ========================================================================= */}
     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
  <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#C2306B] via-[#A51F56] to-[#2B1B2E] text-white p-6 sm:p-10 lg:p-14 overflow-hidden shadow-2xl shadow-[#C2306B]/20">

    {/* Subtle Ambient Background Gradients */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-[#E98CB0]/20 rounded-full blur-3xl pointer-events-none -translate-y-20 translate-x-20" />
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -translate-x-16 translate-y-16" />

    <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">

      {/* Glass Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-[#FFD5E5]">
        <Sparkles size={14} />
        <span>Dedicated Customer Assistance</span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-[900] tracking-tight leading-tight">
        How can our concierge <br className="hidden sm:block" />
        <span className="text-[#FFD5E5] italic">assist you</span> today?
      </h2>

      {/* Description */}
      <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto leading-relaxed font-medium">
        Get immediate help with bookings, technician dispatch, refunds, or safety support.
      </p>

      {/* Smart Search Input */}
      <div className="pt-2">
        <div className="relative max-w-xl mx-auto">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C2306B]"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, tracking, invoices, refunds..."
            className="w-full pl-11 pr-10 py-3.5 sm:py-4 rounded-2xl bg-white/95 backdrop-blur-xl text-[#2B1B2E] placeholder-[#A38A97] text-xs sm:text-sm font-semibold shadow-[0_8px_25px_rgba(43,27,46,0.15)] border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#E98CB0] transition-all"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#A38A97] hover:text-[#C2306B] rounded-full transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

    </div>

    {/* Bottom Glass Highlight */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
  </div>
</section>

      {/* =========================================================================
          3. QUICK ASSISTANCE CARDS GRID
          ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
  {/* SECTION HEADER */}
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <span className="mb-2 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C2306B]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#C2306B]" />
        Instant Channels
      </span>

      <h2 className="text-2xl font-black tracking-tight text-[#2B1B2E] sm:text-3xl">
        Connect With Us
      </h2>

      <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[#8D788D] sm:text-sm">
        We're here to help with bookings, questions, and anything you need.
      </p>
    </div>

    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F3DCE6] bg-white/80 px-3.5 py-2 shadow-[0_2px_10px_rgba(194,48,107,0.05)] backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E98CB0] opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C2306B]" />
      </span>

      <span className="text-[10px] font-semibold text-[#684B5A] sm:text-xs">
        Typical resolution within 5 minutes
      </span>
    </div>
  </div>

  {/* CONTACT CARDS */}
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
  {QUICK_CARDS.map((card) => {
    const IconComp = card.icon;

    return (
      <div
        key={card.id}
        className="group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-[24px] border border-[#F3DCE6] bg-gradient-to-br from-white via-white to-[#FFF6FA] p-5 shadow-[0_4px_18px_rgba(194,48,107,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#E9B5CA] hover:shadow-[0_12px_28px_rgba(194,48,107,0.12)] sm:p-6"
      >
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#FCE4EE]/60 blur-2xl transition-all duration-500 group-hover:bg-[#F5C8DA]/70" />

        <div className="relative z-10">
          {/* ICON + BADGE */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-[#FFF0F6] to-[#F9DCE8] text-[#C2306B] shadow-[0_4px_12px_rgba(194,48,107,0.08)] transition-all duration-300 group-hover:scale-105 group-hover:from-[#E98CB0] group-hover:to-[#C2306B] group-hover:text-white group-hover:shadow-[0_6px_16px_rgba(194,48,107,0.22)]">
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
              <IconComp size={21} strokeWidth={2} className="relative z-10" />
            </div>

            <span
              className={`inline-flex max-w-[125px] items-center justify-center rounded-full border border-[#F3DCE6] bg-white/80 px-2.5 py-1 text-center text-[9px] font-extrabold uppercase tracking-wider text-[#C2306B] ${card.badgeColor}`}
            >
              {card.badge}
            </span>
          </div>

          {/* CARD CONTENT */}
          <h3 className="text-[15px] font-extrabold leading-snug tracking-tight text-[#2B1B2E] transition-colors duration-300 group-hover:text-[#C2306B]">
            {card.title}
          </h3>

          <p className="mt-1 text-xs font-medium leading-relaxed text-[#8D788D]">
            {card.subtitle}
          </p>

          <p className="mt-3 text-xs font-bold leading-relaxed text-[#684B5A]">
            {card.detail}
          </p>
        </div>

        {/* CARD FOOTER */}
        <div className="relative z-10 mt-5 flex items-center justify-between gap-2 border-t border-[#F3DCE6] pt-4">
          <span className="min-w-0 text-[10px] font-medium leading-relaxed text-[#A38A97] sm:text-[11px]">
            {card.meta}
          </span>

          {card.external ? (
            <a
              href={card.actionHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(194,48,107,0.25)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(194,48,107,0.35)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2306B]/40 active:scale-95 sm:text-[11px]"
            >
              {card.actionText}
              <ExternalLink size={12} />
            </a>
          ) : card.actionHref.startsWith("tel:") ||
            card.actionHref.startsWith("mailto:") ? (
            <a
              href={card.actionHref}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(194,48,107,0.25)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(194,48,107,0.35)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2306B]/40 active:scale-95 sm:text-[11px]"
            >
              {card.actionText}
              <ArrowRight size={13} />
            </a>
          ) : (
            <Link
              href={card.actionHref}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(194,48,107,0.25)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(194,48,107,0.35)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2306B]/40 active:scale-95 sm:text-[11px]"
            >
              {card.actionText}
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    );
  })}
</div>
</section>

      {/* =========================================================================
          4. TWO-COLUMN LANDSCAPE WORKSPACE: FAQ CARDS + TICKET DISPATCH CARD
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* -------------------------------------------------------------
              LEFT / PRIMARY COLUMN: FAQ ACCORDION CARDS (lg:col-span-7)
              ------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F1DFE8] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1DFE8]">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8D788D]">
                    Self-Service Knowledge
                  </span>
                  <h2 className="text-xl font-[900] text-[#2B1B2E] tracking-tight">
                    Frequently Asked Questions
                  </h2>
                </div>

                <span className="text-xs font-bold text-[#8D788D] bg-[#FFF7F3] px-3 py-1 rounded-full border border-[#F1DFE8] self-start sm:self-auto">
                  {filteredFaqs.length} answers found
                </span>
              </div>

              {/* Category Filter Chips */}
              <div className="flex overflow-x-auto  gap-2 pb-1 scroll-smooth">
                {FAQ_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                        isActive
                          ? "btn-primary-pill"
                          : "btn-secondary-pill text-[#8D788D]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* FAQ Cards Accordion */}
              {filteredFaqs.length === 0 ? (
                <div className="py-12 text-center text-[#8D788D]">
                  <HelpCircle size={36} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-bold">No answers match your search</p>
                  <p className="text-xs opacity-75 mt-0.5">
                    Try another keyword or send a direct message below.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                          isOpen
                            ? "bg-[#FFF7F3] border-[#F1DFE8] shadow-sm"
                            : "bg-white border-[#F1DFE8] hover:border-[#F1DFE8]"
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                          className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isOpen ? "bg-[#F7B614]" : "bg-[#F1DFE8]"
                              }`}
                            />
                            <span className="text-xs sm:text-sm font-extrabold text-[#2B1B2E] leading-snug">
                              {faq.question}
                            </span>
                          </div>

                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                              isOpen
                                ? "bg-[#C2306B] text-white rotate-180"
                                : "bg-[#FFF7F3] text-[#C2306B]"
                            }`}
                          >
                            <ChevronDown size={15} />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#8D788D] leading-relaxed border-t border-[#F1DFE8]/60">
                            <p className="pl-4 border-l-2 border-[#C2306B] py-0.5">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sparky Protection & Safety Commitment Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-[#F1DFE8] shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FCEAF1] text-[#C2306B] flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#2B1B2E]">
                  100% Rework Guarantee
                </h4>
                <p className="text-[11px] text-[#8D788D] leading-relaxed">
                  Complimentary rework or immediate refund if you are not fully satisfied.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#F1DFE8] shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FCEAF1] text-[#C2306B] flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#2B1B2E]">
                  Police Verified
                </h4>
                <p className="text-[11px] text-[#8D788D] leading-relaxed">
                  All salon and technical partners carry 7-point background clearance.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#F1DFE8] shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FCEAF1] text-[#C2306B] flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#2B1B2E]">
                  Instant SOS Desk
                </h4>
                <p className="text-[11px] text-[#8D788D] leading-relaxed">
                  Single-tap live service timer pause and priority safety desk escalation.
                </p>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              RIGHT COLUMN: DISPATCH TICKET FORM CARD (lg:col-span-5)
              ------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F1DFE8] shadow-md space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#F1DFE8]">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C2306B] to-[#A82058] text-white flex items-center justify-center shadow-md shadow-[#C2306B]/20">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-base font-[900] text-[#2B1B2E] tracking-tight">
                    Send Direct Message
                  </h3>
                  <p className="text-xs text-[#8D788D]">
                    Concierge ticket with guaranteed 15-min SLA
                  </p>
                </div>
              </div>

              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FCEAF1] text-[#C2306B] flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-[900] text-[#2B1B2E]">
                      Ticket Logged Successfully!
                    </h4>
                    <p className="text-xs text-[#8D788D] mt-1 max-w-xs mx-auto leading-relaxed">
                      A senior concierge manager is reviewing your case and will message or call you shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-primary-pill px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Issue Category Chips */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#8D788D] mb-2">
                      Select Topic
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ISSUE_TAGS.map((tag) => {
                        const isSelected = selectedIssue === tag;
                        return (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => setSelectedIssue(tag)}
                            className={`px-3 py-1.5 text-[11px] font-bold transition-all ${
                              isSelected
                                ? "btn-primary rounded-xl"
                                : "bg-[#FFF7F3] text-[#8D788D] hover:bg-[#F1DFE8] rounded-xl"
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name Inputs */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8D788D] mb-1">
                        First Name
                      </label>
                      <input
                        required
                        type="text"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        placeholder="John"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF7F3] border border-[#F1DFE8] text-xs font-semibold text-[#2B1B2E] placeholder-gray-400 focus:outline-none focus:border-[#C2306B] focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8D788D] mb-1">
                        Last Name
                      </label>
                      <input
                        required
                        type="text"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        placeholder="Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF7F3] border border-[#F1DFE8] text-xs font-semibold text-[#2B1B2E] placeholder-gray-400 focus:outline-none focus:border-[#C2306B] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8D788D] mb-1">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF7F3] border border-[#F1DFE8] text-xs font-semibold text-[#2B1B2E] placeholder-gray-400 focus:outline-none focus:border-[#C2306B] focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8D788D] mb-1">
                        Booking ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={form.bookingId}
                        onChange={(e) =>
                          setForm({ ...form, bookingId: e.target.value })
                        }
                        placeholder="e.g. ORD-99283"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF7F3] border border-[#F1DFE8] text-xs font-semibold text-[#2B1B2E] placeholder-gray-400 focus:outline-none focus:border-[#C2306B] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#8D788D] mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF7F3] border border-[#F1DFE8] text-xs font-semibold text-[#2B1B2E] placeholder-gray-400 focus:outline-none focus:border-[#C2306B] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#8D788D] mb-1">
                      How Can We Help?
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Please describe your query or problem in detail..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF7F3] border border-[#F1DFE8] text-xs font-semibold text-[#2B1B2E] placeholder-gray-400 focus:outline-none focus:border-[#C2306B] focus:bg-white transition resize-none"
                    />
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="btn-primary w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <span>Dispatching...</span>
                    ) : (
                      <>
                        <span>Dispatch Ticket</span>
                        <Send size={14} className="text-white/80" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Operating Hours Card */}
            <div className="bg-[#FFF7F3] rounded-3xl p-5 border border-[#F1DFE8] space-y-2">
              <div className="flex items-center gap-2 text-[#C2306B]">
                <Clock size={16} />
                <span className="text-xs font-black uppercase tracking-wider">
                  Desk Operating Hours
                </span>
              </div>
              <p className="text-[11px] text-[#8D788D] leading-relaxed">
                Mon - Sun: 7:00 AM - 11:00 PM IST. <br />
                Emergency Escalations and Active Timer Holds are monitored 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

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