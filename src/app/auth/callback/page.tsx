"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenManager } from "@/app/lib/api";

const APIM_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apim-quick-speak.azure-api.net';
const APIM_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * Página de callback para autenticación OAuth (Google vía Azure EasyAuth)
 *
 * Flujo:
 * 1. Usuario hace clic en "Login with Google"
 * 2. Azure EasyAuth maneja la autenticación con Google
 * 3. Usuario es redirigido a esta página
 * 4. Esta página obtiene la información del usuario directamente de /.auth/me (cliente)
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

      // 1. Obtener información del usuario de Azure EasyAuth directamente desde el cliente
      // Esto evita problemas de SSL al hacer fetch desde el servidor
      const easyAuthResponse = await fetch('/.auth/me');

      if (!easyAuthResponse.ok) {
        throw new Error('Failed to get authentication information from EasyAuth');
      }

      const easyAuthArray = await easyAuthResponse.json();

      // EasyAuth retorna un array con la información del usuario
      if (!easyAuthArray || easyAuthArray.length === 0) {
        throw new Error('No authentication data found');
      }

      const authData = easyAuthArray[0];
      const claims = authData.user_claims || [];

      // Función helper para extraer claims
      const getClaim = (type: string) => {
        const claim = claims.find((c: any) => c.typ === type);
        return claim ? claim.val : null;
      };

      // Extraer información del usuario desde los claims
      const email = getClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress');
      const name = getClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name');
      const givenName = getClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname');
      const surname = getClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname');

      // Validar que tenemos la información necesaria
      if (!email) {
        throw new Error('Email not provided by authentication provider');
      }

      setStatus("Creating user session...");

      // 2. Extraer nombre y apellido
      // Prioridad: givenName/surname > name dividido > email
      let firstName = givenName || '';
      let lastName = surname || '';

      if (!firstName && !lastName && name) {
        // Intentar dividir el nombre completo
        const nameParts = name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      // Si aún no tenemos nombre, usar el email
      if (!firstName) {
        firstName = email.split('@')[0];
      }
      if (!lastName) {
        lastName = 'User';
      }

      // 3. Enviar información al microservicio a través de APIM
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (APIM_KEY) {
        headers['Ocp-Apim-Subscription-Key'] = APIM_KEY;
      }

      const oauthResponse = await fetch(`${APIM_URL}/users/api/v1/auth/oauth/google`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: email,
          firstName: firstName,
          lastName: lastName,
          provider: authData.provider_name || 'google',
          providerId: authData.user_id || email,
        }),
      });

      if (!oauthResponse.ok) {
        const errorData = await oauthResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create user session');
      }

      const userData = await oauthResponse.json();

      // 4. Guardar token JWT y userId
      if (userData.token) {
        tokenManager.saveToken(userData.token, userData.userId);
        console.log('JWT token and userId saved successfully');
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
