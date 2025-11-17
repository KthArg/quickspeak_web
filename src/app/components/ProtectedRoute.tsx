"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenManager } from "@/app/lib/api";

type ProtectedRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

/**
 * Componente que protege rutas privadas
 * Redirige a /login si el usuario no está autenticado
 */
export function ProtectedRoute({
  children,
  redirectTo = "/login"
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Verificar si hay un token en localStorage
      const hasToken = tokenManager.hasToken();

      if (!hasToken) {
        // No hay token, redirigir a login
        router.push(redirectTo);
      } else {
        // Hay token, permitir acceso
        setIsAuthorized(true);
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [router, redirectTo]);

  // Mostrar loading mientras se verifica la autenticación
  if (isChecking) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#232323] to-[#2c006e]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, no mostrar nada (ya se redirigió)
  if (!isAuthorized) {
    return null;
  }

  // Usuario autenticado, mostrar contenido
  return <>{children}</>;
}
