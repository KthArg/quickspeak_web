// app/api/auth/easyauth-info/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para obtener información del usuario autenticado vía Azure EasyAuth
 * Este endpoint consulta /.auth/me para obtener los claims del usuario
 */
export async function GET(request: NextRequest) {
  try {
    // En producción (Azure Static Web Apps con EasyAuth habilitado)
    // /.auth/me retorna información del usuario autenticado
    const authMeUrl = `${request.nextUrl.origin}/.auth/me`;

    const response = await fetch(authMeUrl, {
      headers: request.headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Not authenticated via EasyAuth' },
        { status: 401 }
      );
    }

    const data = await response.json();

    // EasyAuth retorna un array con la información del usuario
    // Ejemplo: [{ provider_name: "google", user_id: "...", user_claims: [...] }]
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No authentication data found' },
        { status: 401 }
      );
    }

    const authData = data[0];
    const claims = authData.user_claims || [];

    // Extraer información útil de los claims
    const getClaim = (type: string) => {
      const claim = claims.find((c: any) => c.typ === type);
      return claim ? claim.val : null;
    };

    // Mapear claims comunes de Google OAuth
    const userInfo = {
      provider: authData.provider_name,
      providerId: authData.user_id,
      email: getClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'),
      name: getClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'),
      givenName: getClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'),
      surname: getClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'),
    };

    return NextResponse.json(userInfo);
  } catch (error: any) {
    console.error('Error fetching EasyAuth info:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch authentication info' },
      { status: 500 }
    );
  }
}
