import { apiClient, type SendMessageRequest, type SendMessageResponse } from '@/app/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body: SendMessageRequest = await request.json();
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const data = await apiClient.post<SendMessageResponse>(
      `/conversation/chat/session/${sessionId}/message`,
      { ...body, userId }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(
      "Error en POST /api/chat/session/[sessionId]/message:",
      error
    );
    return NextResponse.json(
      { error: error?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
