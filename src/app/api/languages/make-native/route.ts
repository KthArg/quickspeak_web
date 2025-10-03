// app/api/languages/native/route.ts
import { apiClient } from '@/app/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 Body recibido:', body); // Debug
    
    const data = await apiClient.post('/languages/make-native', body);
    console.log('✅ Respuesta exitosa:', data); // Debug
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error en /languages/make-native:', error); // Debug detallado
    console.error('Error message:', error.message); // Debug mensaje
    
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}