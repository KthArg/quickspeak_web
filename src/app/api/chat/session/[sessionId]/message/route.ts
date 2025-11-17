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
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}