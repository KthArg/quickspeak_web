// src/app/api/dictionary/words/[id]/forget/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/lib/api';
import { resolveUserIdFromRequest } from '@/app/lib/auth';
import { publishNotification } from '@/app/lib/notification_publisher';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 0) Leer el body que manda el frontend (puede traer 'word')
    let wordFromClient: string | undefined = undefined;
    try {
      const body = await request.json();
      if (body && typeof body.word === 'string') {
        wordFromClient = body.word;
      }
    } catch {
    }

    // 1) Core real (APIM): olvidar palabra
    const coreResp = await apiClient.post(`/dictionary/words/${id}/forget`, {});
    console.log('[forget] Core respondió OK para id=', id);

    const coreData: any = (coreResp as any)?.data ?? coreResp;
    const wordFromCore: string | undefined =
      coreData?.word ??
      coreData?.text ??
      coreData?.value ??
      coreData?.payload?.word ??
      coreData?.deletedWord ??
      coreData?.deleted?.word;

    const finalWord = wordFromClient || wordFromCore;

    // 2) userId desde JWT del cliente
    const userId = resolveUserIdFromRequest(request) || '123';

    // 3) Azure Service Bus
    await publishNotification({
      type: 'WORD_FORGOTTEN',
      userId,
      title: 'Palabra olvidada',
      message: finalWord
        ? `Se marcó como olvidada la palabra "${finalWord}".`
        : `Se marcó como olvidada una palabra (ID=${id}).`,
      data: {
        wordId: id,
        ...(finalWord ? { word: finalWord } : {}),
      },
    });

    console.log(
      '[forget] ✅ Notificación WORD_FORGOTTEN enviada a Service Bus con data:',
      { wordId: id, word: finalWord }
    );

    // 4) Responder a la UI igual que antes
    return NextResponse.json(coreResp);
  } catch (error: any) {
    console.error('[forget] ❌ Error en POST /forget:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Unexpected error' },
      { status: 500 }
    );
  }
}
