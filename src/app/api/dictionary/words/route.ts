// app/api/dictionary/words/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/lib/api';
import jwt from 'jsonwebtoken';
import { publishNotification } from '@/app/lib/notification_publisher';

/**
 * Helper: extraer userId (sub) del Authorization: Bearer <token> que mande el cliente
 */
function getUserIdFromAuth(req: NextRequest): string {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return '123'; // fallback para pruebas
  try {
    const decoded: any = jwt.decode(token);
    return decoded?.sub ?? '123';
  } catch {
    return '123';
  }
}

// =========================
// GET: lista de palabras
// =========================
export async function GET() {
  try {
    const data = await apiClient.get('/conversation/dictionary/words');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// =========================
// POST: crear palabra
// =========================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any));
    const { word, lang } = body || {};

    if (!word || !lang) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: 'word' y 'lang'." },
        { status: 400 }
      );
    }

    const userId = getUserIdFromAuth(request);

    let created: any = null;
    try {
      created = await apiClient.post('/dictionary/words', { word, lang });
    } catch (err: any) {
      // Si es 404/Resource not found, seguimos con la notificación para no bloquear pruebas
      const msg = String(err?.message || '');
      const notFound =
        msg.toLowerCase().includes('resource not found') ||
        msg.toLowerCase().includes('404');

      if (!notFound) {
        throw err;
      }

      created = {
        ok: true,
        id: null,
        word,
        lang,
        note: 'Backend core no tiene POST /dictionary/words (simulado para pruebas).',
      };
    }

    // 👉 AHORA: publicar en Azure Service Bus, NO por HTTP
    await publishNotification({
      type: 'WORD_SAVED',
      userId,
      title: 'Palabra guardada',
      message: `Se guardó la palabra "${word}" (${lang}).`,
      data: {
        word,
        lang,
        wordId: created?.id ?? created?.wordId ?? null,
      },
    });

    return NextResponse.json(created);
  } catch (error: any) {
    console.error('[words/POST] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
