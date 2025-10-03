// app/api/dictionary/words/update/route.ts
import { apiClient } from '@/app/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await apiClient.post('/dictionary/words/update-translations', body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}