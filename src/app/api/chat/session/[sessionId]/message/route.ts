import { apiClient } from '@/app/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // ✅ Await params primero
    const { sessionId } = await params;
    const body = await request.json();
    const data = await apiClient.post(
      `/chat/session/${sessionId}/message`,
      body
    );
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}