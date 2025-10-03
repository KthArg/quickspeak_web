import { apiClient } from '@/app/lib/api';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // ✅ Await params primero
    const { sessionId } = await params;
    const data = await apiClient.get(`/chat/session/${sessionId}`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}