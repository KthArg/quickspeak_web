// app/api/dictionary/words/update/route.ts
import { apiClient } from '@/app/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import { publishNotificationMessage } from '@/app/lib/serviceBus';
import { resolveUserIdFromRequest } from '@/app/lib/auth';

/**
 * POST /api/dictionary/words/update
 * Actualiza traducciones en el backend real y luego publica una notificación WORD_UPDATED
 * para el usuario autenticado (Opción B: publish desde el frontend a Service Bus).
 */
export async function POST(request: NextRequest) {
  try {
    // 1) Leer body con tolerancia a errores
    const body = await request.json().catch(() => ({} as any));
    const { word, translations } = (body || {}) as {
      word?: string;
      translations?: Record<string, string>;
    };

    // 2) Validaciones mínimas
    if (!word || typeof word !== 'string') {
      return NextResponse.json(
        { error: "Falta 'word' (string) en el body." },
        { status: 400 }
      );
    }
    if (!translations || typeof translations !== 'object') {
      return NextResponse.json(
        { error: "Falta 'translations' (objeto) en el body." },
        { status: 400 }
      );
    }

    // 3) Llamar a tu backend real para actualizar traducciones
    //    ⚠️ Ajusta la ruta si en tu core es distinta.
    let updated: any;
    try {
      updated = await apiClient.post('/dictionary/words/update-translations', body);
    } catch (err: any) {
      const msg = String(err?.message || '');
      // Si tu core devuelve 404, lo mapeamos claro al cliente
      if (msg.toLowerCase().includes('404') || msg.toLowerCase().includes('not found')) {
        return NextResponse.json(
          { error: 'Recurso no encontrado en el core (404).' },
          { status: 404 }
        );
      }
      // Otros errores => 500
      return NextResponse.json(
        { error: msg || 'Error al actualizar traducciones en el core.' },
        { status: 500 }
      );
    }

    // 4) Resolver userId desde el JWT que mandó el cliente
    const userId = resolveUserIdFromRequest(request) || '123';

    // 5) Publicar notificación WORD_UPDATED a Service Bus (vía notification-service)
    //    El message shape ya es compatible con tu consumer.
    await publishNotificationMessage({
      type: 'WORD_UPDATED',
      userId,
      data: {
        word,
        // Opcionalmente puedes enviar el snapshot de translations para mostrar en el toast
        translations
      }
    });

    // 6) Responder a la UI lo que devolvió tu core
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: String(error?.message || error) },
      { status: 500 }
    );
  }
}
