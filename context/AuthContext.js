"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  user: null,
  loading: true,
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  refreshUser: async () => null,
  logout: async () => {},
  handleLoginSuccess: () => {},
});

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    onSuccess: null,
    redirectTo: null,
  });

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data?.user || null);
        return data?.user || null;
      } else {
        setUser(null);
        return null;
      }
    } catch (e) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen for custom cross-component auth change triggers
    const handleAuthEvent = () => {
      refreshUser();
    };
    window.addEventListener("sparky-auth-refresh", handleAuthEvent);
    return () => {
      window.removeEventListener("sparky-auth-refresh", handleAuthEvent);
    };
  }, [refreshUser]);

  const openLoginModal = useCallback((options = {}) => {
    setModalConfig({
      isOpen: true,
      onSuccess: typeof options?.onSuccess === "function" ? options.onSuccess : null,
      redirectTo: options?.redirectTo || null,
    });
  }, []);

  const closeLoginModal = useCallback(() => {
    setModalConfig({
      isOpen: false,
      onSuccess: null,
      redirectTo: null,
    });
  }, []);

  const handleLoginSuccess = useCallback(
    async (authenticatedUser) => {
      // 1. Fetch freshly set user or set directly
      let latestUser = authenticatedUser;
      if (!latestUser) {
        latestUser = await refreshUser();
      } else {
        setUser(latestUser);
      }

      // 2. Capture callback and redirect before closing
      const { onSuccess, redirectTo } = modalConfig;

      // 3. Close modal
      closeLoginModal();

      // 4. Trigger callback if provided
      if (onSuccess) {
        try {
          onSuccess(latestUser);
        } catch (err) {
          console.error("Error running login onSuccess callback:", err);
        }
      }

      // 5. Navigate if redirectTo provided
      if (redirectTo) {
        router.push(redirectTo);
      }

      // Broadcast to other components
      window.dispatchEvent(new Event("sparky-auth-refresh"));
    },
    [modalConfig, closeLoginModal, refreshUser, router]
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      window.dispatchEvent(new Event("sparky-auth-refresh"));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoginModalOpen: modalConfig.isOpen,
        openLoginModal,
        closeLoginModal,
        refreshUser,
        logout,
        handleLoginSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
