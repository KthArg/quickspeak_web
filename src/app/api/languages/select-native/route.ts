// app/api/languages/select-native/route.ts
import { apiClient } from '@/app/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { languageId } = body;
    const data = await apiClient.put(`/user/languages/${languageId}/native`, body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}