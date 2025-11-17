"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { tokenManager } from "@/app/lib/api";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userId: number) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/sign_up",
  "/auth/callback",
];

// Rutas que requieren completar el onboarding
const ONBOARDING_ROUTES = [
  "/pick_native_language",
  "/pick_starting_languages",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verificar si el usuario tiene un token válido
    const checkAuth = () => {
      const hasToken = tokenManager.hasToken();
      setIsAuthenticated(hasToken);
      setIsLoading(false);

      // Si no está en el navegador, no hacer redirección
      if (typeof window === "undefined") return;

      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      const isOnboardingRoute = ONBOARDING_ROUTES.includes(pathname);

      // Si no tiene token y no está en una ruta pública
      if (!hasToken && !isPublicRoute && !isOnboardingRoute) {
        console.log("No authenticated, redirecting to login from:", pathname);
        router.push("/login");
      }

      // Si tiene token y está intentando acceder a login o signup, redirigir a dashboard
      if (hasToken && (pathname === "/login" || pathname === "/sign_up")) {
        console.log("Already authenticated, redirecting to dashboard");
        router.push("/dashboard/speakers");
      }
    };

    checkAuth();
  }, [pathname, router]);

  const login = (token: string, userId: number) => {
    tokenManager.saveToken(token, userId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    tokenManager.removeToken();
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
