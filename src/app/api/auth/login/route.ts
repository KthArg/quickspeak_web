// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8082';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Llamar al microservicio de autenticación
    const response = await fetch(`${USER_SERVICE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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