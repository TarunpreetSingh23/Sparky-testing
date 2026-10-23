"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Edit2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const INITIAL_TIMER = 30;

export default function LoginBottomSheet({
  isOpen: propIsOpen,
  onClose: propOnClose,
  onSuccess: propOnSuccess,
}) {
  const auth = useAuth();
  const isOpen = propIsOpen !== undefined ? propIsOpen : auth.isLoginModalOpen;
  const onClose = propOnClose || auth.closeLoginModal;
  const onLoginSuccess = propOnSuccess || auth.handleLoginSuccess;

  const [step, setStep] = useState("phone"); // 'phone' | 'otp'
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  const phoneInputRef = useRef(null);
  const otpInputsRef = useRef([]);

  // Reset state whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setPhone("");
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setTimer(0);
      setLoading(false);

      // Focus phone input smoothly
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Prevent background scrolling while bottom sheet is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Resend Countdown Timer
  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  // Focus first OTP field when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Phone input formatting (digits only, max 10)
  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(raw);
    if (error) setError("");
  };

  // OTP inputs handling
  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    // If pasted full OTP (or multiple digits)
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, 6).split("");
      const nextOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) nextOtp[i] = d;
      });
      setOtp(nextOtp);
      const focusIndex = Math.min(digits.length, 5);
      otpInputsRef.current[focusIndex]?.focus();
      if (error) setError("");
      return;
    }

    // Single digit input
    const nextOtp = [...otp];
    nextOtp[index] = cleaned[0];
    setOtp(nextOtp);
    if (error) setError("");

    // Automatically shift to next box
    if (index < 5 && cleaned[0]) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && otp.join("").length === 6) {
      handleVerifyOtp();
    }
  };

  // SEND OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send OTP. Please try again.");
      }

      setStep("otp");
      setOtp(["", "", "", "", "", ""]);
      setTimer(INITIAL_TIMER);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpValue }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Invalid OTP. Please try again.");
      }

      // Success
      if (onLoginSuccess) {
        onLoginSuccess(data?.user || { phone });
      } else {
        onClose();
      }
    } catch (err) {
      setError(err?.message || "Invalid OTP. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/55 backdrop-blur-[4px]"
          />

          {/* BOTTOM SHEET */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Sparky Login Sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="
              relative z-[130] w-full max-w-[440px]
              rounded-t-[32px] border-t border-x border-[#F3DCE6]
              bg-white px-5 pt-3 pb-7 sm:px-7 sm:pb-8
              shadow-[0_-16px_50px_rgba(43,27,46,0.22)]
              text-[#2B1B2E] select-none
            "
          >
            {/* DRAG HANDLE */}
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#E5CBD6]" />

            {/* TOP BAR: BADGE & CLOSE BUTTON */}
            <div className="flex items-center justify-between pb-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F3DCE6] bg-[#FFF2F7] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#C2306B]">
                <Sparkles size={12} className="text-[#C2306B]" />
                <span>Sparky Verified Login</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close login dialog"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F3DCE6] bg-white text-[#684B5A] shadow-sm transition-colors hover:bg-[#FFF2F7] hover:text-[#C2306B] active:scale-95"
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            {/* HEADER TEXT */}
            <div className="mt-2 text-left">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#2B1B2E]">
                {step === "phone" ? "Welcome to Sparky" : "Verify Mobile Number"}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#684B5A] leading-relaxed">
                {step === "phone"
                  ? "Enter your mobile number to access your account, bookings & seamless checkout."
                  : `Enter the 6-digit OTP sent to +91 ${phone}`}
              </p>
            </div>

            {/* ERROR NOTIFICATION BANNER */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/90 px-3.5 py-2.5 text-xs font-semibold text-rose-700 shadow-sm"
              >
                <AlertCircle size={16} className="shrink-0 text-rose-500" />
                <span className="flex-1">{error}</span>
              </motion.div>
            )}

            {/* ================= STEP 1: PHONE INPUT ================= */}
            {step === "phone" && (
              <form onSubmit={handleSendOtp} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="sparky-phone-input"
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-[#8D788D] mb-1.5 pl-1"
                  >
                    Mobile Number
                  </label>

                  <div className="relative flex items-center rounded-2xl border-2 border-[#F3DCE6] bg-[#FFF9FB] px-3.5 py-2.5 transition-all focus-within:border-[#C2306B] focus-within:bg-white focus-within:shadow-[0_4px_16px_rgba(194,48,107,0.12)]">
                    {/* Country Code Pill */}
                    <div className="flex items-center gap-1.5 border-r border-[#F3DCE6] pr-3 font-black text-sm text-[#2B1B2E]">
                      <span className="text-base leading-none">🇮🇳</span>
                      <span>+91</span>
                    </div>

                    {/* Numeric Input */}
                    <input
                      id="sparky-phone-input"
                      ref={phoneInputRef}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="98765 43210"
                      disabled={loading}
                      autoComplete="tel"
                      className="w-full bg-transparent pl-3.5 text-base font-extrabold tracking-wider text-[#2B1B2E] placeholder-[#C2B2BA] outline-none disabled:opacity-50"
                    />

                    {phone.length === 10 && (
                      <span className="shrink-0 rounded-full bg-emerald-100 p-1 text-emerald-600">
                        <CheckCircle2 size={16} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={phone.length !== 10 || loading}
                  className="
                    relative mt-2 flex h-13 w-full items-center justify-center gap-2
                    rounded-2xl border border-white/40
                    bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56]
                    text-xs font-black uppercase tracking-wider text-white
                    shadow-[0_8px_24px_rgba(194,48,107,0.28)]
                    transition-all duration-200
                    hover:shadow-[0_10px_28px_rgba(194,48,107,0.38)]
                    active:scale-[0.98]
                    disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none
                  "
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    <>
                      <span>Get OTP</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* TRUST & COMPLIANCE FOOTER */}
                <div className="pt-2 text-center">
                  <p className="text-[10px] font-medium leading-relaxed text-[#8D788D]">
                    By continuing, you agree to Sparky's{" "}
                    <a
                      href="/t&c"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#C2306B] underline underline-offset-2"
                    >
                      Terms of Service
                    </a>{" "}
                    &{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#C2306B] underline underline-offset-2"
                    >
                      Privacy Policy
                    </a>
                  </p>

                  <div className="mt-3.5 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-[#684B5A]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      256-Bit SSL Safe
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#E5CBD6]" />
                    <span className="flex items-center gap-1">
                      <Lock size={12} className="text-[#C2306B]" />
                      No Password Needed
                    </span>
                  </div>
                </div>
              </form>
            )}

            {/* ================= STEP 2: OTP INPUT ================= */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
                {/* Number edit pill */}
                <div className="flex items-center justify-between rounded-xl border border-[#F3DCE6] bg-[#FFF8FA] px-3.5 py-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B1B2E]">
                    <span>Sent to:</span>
                    <span className="font-extrabold text-[#C2306B]">
                      +91 {phone}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setError("");
                    }}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-[#C2306B] hover:underline"
                  >
                    <Edit2 size={12} />
                    <span>Change</span>
                  </button>
                </div>

                {/* 6 Digit Input Boxes */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#8D788D] mb-2 pl-1">
                    Enter 6-Digit OTP
                  </label>

                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        disabled={loading}
                        aria-label={`OTP digit ${idx + 1}`}
                        className={`
                          h-12 w-11 sm:h-13 sm:w-12 text-center text-lg font-black
                          rounded-xl border-2 transition-all outline-none
                          ${
                            digit
                              ? "border-[#C2306B] bg-[#FFF2F7] text-[#C2306B]"
                              : "border-[#F3DCE6] bg-[#FFF9FB] text-[#2B1B2E] focus:border-[#C2306B] focus:bg-white focus:shadow-[0_4px_12px_rgba(194,48,107,0.15)]"
                          }
                        `}
                      />
                    ))}
                  </div>
                </div>

                {/* Resend Countdown */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#8D788D] font-medium">
                    Didn't receive code?
                  </span>

                  {timer > 0 ? (
                    <span className="font-bold text-[#8D788D]">
                      Resend in{" "}
                      <span className="text-[#C2306B] font-extrabold">
                        {timer}s
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="font-extrabold text-[#C2306B] underline underline-offset-2 hover:text-[#A51F56] transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={otp.join("").length !== 6 || loading}
                  className="
                    relative mt-2 flex h-13 w-full items-center justify-center gap-2
                    rounded-2xl border border-white/40
                    bg-gradient-to-r from-[#E98CB0] via-[#C2306B] to-[#A51F56]
                    text-xs font-black uppercase tracking-wider text-white
                    shadow-[0_8px_24px_rgba(194,48,107,0.28)]
                    transition-all duration-200
                    hover:shadow-[0_10px_28px_rgba(194,48,107,0.38)]
                    active:scale-[0.98]
                    disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none
                  "
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Verifying Code...</span>
                    </div>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
