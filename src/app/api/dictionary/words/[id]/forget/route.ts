import { apiClient } from '@/app/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params primero
    const { id } = await params;
    const data = await apiClient.post(`/dictionary/words/${id}/forget`, {});
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}