// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';

const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8082';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar que tenemos los campos requeridos
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Missing required fields: email, password, firstName, lastName'
        },
        { status: 400 }
      );
    }

    // Llamar al microservicio de registro
    const response = await fetch(`${USER_SERVICE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      return NextResponse.json(
        {
          ok: false,
          message: errorData.message || 'Failed to create account'
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transformar la respuesta del microservicio al formato esperado por el frontend
    // Microservicio retorna: { token, userId, email, firstName, lastName }
    // Frontend espera: { ok: true, token, userId, email, firstName, lastName, next }
    return NextResponse.json(
      {
        ok: true,
        token: data.token,
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        user: {
          id: data.userId,
          email: data.email
        },
        next: '/pick_native_language'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        ok: false,
        message: error.message || 'Network error. Please try again.'
      },
      { status: 500 }
    );
  }
}