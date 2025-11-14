"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenManager } from "@/app/lib/api";

const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8082';

/**
 * Página de callback para autenticación OAuth (Google vía Azure EasyAuth)
 *
 * Flujo:
 * 1. Usuario hace clic en "Login with Google"
 * 2. Azure EasyAuth maneja la autenticación con Google
 * 3. Usuario es redirigido a esta página
 * 4. Esta página obtiene la información del usuario de EasyAuth
 * 5. Envía la información al microservicio para crear/actualizar usuario
 * 6. Guarda el JWT token
 * 7. Redirige al dashboard o página configurada
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Authenticating...");

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      setStatus("Obtaining user information...");

      // 1. Obtener información del usuario de Azure EasyAuth
      const easyAuthResponse = await fetch('/api/auth/easyauth-info');

      if (!easyAuthResponse.ok) {
        throw new Error('Failed to get authentication information from EasyAuth');
      }

      const easyAuthData = await easyAuthResponse.json();

      // Validar que tenemos la información necesaria
      if (!easyAuthData.email) {
        throw new Error('Email not provided by authentication provider');
      }

      setStatus("Creating user session...");

      // 2. Extraer nombre y apellido
      // Prioridad: givenName/surname > name dividido > email
      let firstName = easyAuthData.givenName || '';
      let lastName = easyAuthData.surname || '';

      if (!firstName && !lastName && easyAuthData.name) {
        // Intentar dividir el nombre completo
        const nameParts = easyAuthData.name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      // Si aún no tenemos nombre, usar el email
      if (!firstName) {
        firstName = easyAuthData.email.split('@')[0];
      }
      if (!lastName) {
        lastName = 'User';
      }

      // 3. Enviar información al microservicio
      const oauthResponse = await fetch(`${USER_SERVICE_URL}/api/v1/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: easyAuthData.email,
          firstName: firstName,
          lastName: lastName,
          provider: easyAuthData.provider || 'google',
          providerId: easyAuthData.providerId || easyAuthData.email,
        }),
      });

      if (!oauthResponse.ok) {
        const errorData = await oauthResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create user session');
      }

      const userData = await oauthResponse.json();

      // 4. Guardar token JWT
      if (userData.token) {
        tokenManager.saveToken(userData.token);
        console.log('JWT token saved successfully');
      } else {
        throw new Error('No token received from authentication service');
      }

      setStatus("Redirecting...");

      // 5. Redirigir al dashboard o página apropiada
      // Si es un usuario nuevo, llevarlo a configurar idioma nativo
      // Si es usuario existente, llevarlo al dashboard
      const redirectUrl = oauthResponse.status === 201
        ? '/pick_native_language'
        : '/dashboard/speakers';

      window.location.href = redirectUrl;

    } catch (err: any) {
      console.error('OAuth callback error:', err);
      setError(err.message || 'Authentication failed');
      setStatus('Authentication failed');

      // Redirigir a login después de 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-purple-900">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          {!error ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {status}
              </h2>
              <p className="text-gray-600">
                Please wait while we complete your authentication...
              </p>
            </>
          ) : (
            <>
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Authentication Error
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-gray-600">
                Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
