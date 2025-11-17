// app/api/languages/select-native/route.ts
import { apiClient } from '@/app/lib/api';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET - Obtener idiomas disponibles para selección de idioma nativo
 */
export async function GET() {
  try {
    const data = await apiClient.get('/languages/select-native');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

/**
 * PUT - Marcar idioma como nativo del usuario
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { languageId } = body;
    const data = await apiClient.put(`/user/languages/${languageId}/native`, body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}