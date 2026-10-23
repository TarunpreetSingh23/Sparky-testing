"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import LoginBottomSheet from "@/components/LoginBottomSheet";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Permanent auto-recovery for Webpack ChunkLoadError (stale development chunks)
  useEffect(() => {
    const handleChunkError = (err) => {
      const msg = err?.message || String(err || "");
      const isChunk =
        msg.includes("Loading chunk") ||
        msg.includes("ChunkLoadError") ||
        err?.name === "ChunkLoadError";

      if (isChunk && typeof window !== "undefined") {
        const last = sessionStorage.getItem("spk_chunk_reload");
        const now = Date.now();
        if (!last || now - parseInt(last, 10) > 6000) {
          sessionStorage.setItem("spk_chunk_reload", String(now));
          window.location.reload();
        }
      }
    };

    window.addEventListener("error", (e) => handleChunkError(e.error || e));
    window.addEventListener("unhandledrejection", (e) =>
      handleChunkError(e.reason)
    );
  }, []);

  const hideNavbar =
    pathname === "/checkout" ||
    pathname === "/cart";

  const hideFooter =
    pathname === "/checkout" ||
    pathname === "/cart" ||
    pathname === "/beauty" ||
    pathname.startsWith("/services/");

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />}

      <main>
        {children}
        <Toaster position="top-right" />
      </main>

      <LoginBottomSheet />

      {!hideFooter && <Footer />}
    </AuthProvider>
  );
}