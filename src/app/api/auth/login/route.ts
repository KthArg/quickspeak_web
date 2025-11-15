// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

const APIM_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apim-quick-speak.azure-api.net';
const APIM_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Preparar headers para APIM
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Agregar subscription key si está configurada
    if (APIM_KEY) {
      headers['Ocp-Apim-Subscription-Key'] = APIM_KEY;
    }

    // Llamar al microservicio de autenticación a través de APIM
    const response = await fetch(`${APIM_URL}/users/api/v1/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Invalid email or password'
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transformar la respuesta del microservicio al formato esperado por el frontend
    // Microservicio retorna: { token, userId, email, firstName, lastName }
    // Frontend espera: { success: true, user: {...}, token, expiresIn }
    return NextResponse.json({
      success: true,
      token: data.token,
      user: {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
      },
      expiresIn: 86400, // 24 horas
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Network error. Please try again.'
      },
      { status: 500 }
    );
  }
}