// src/app/api/dictionary/words/[id]/forget/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/app/lib/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await apiClient.post(`/conversation/dictionary/words/${id}/forget`, {});
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[forget] ❌ Error en POST /forget:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Unexpected error' },
      { status: 500 }
    );
  }
}
