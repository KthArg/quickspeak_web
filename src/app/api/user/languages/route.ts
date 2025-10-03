// app/api/user/languages/route.ts
import { apiClient } from '@/app/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await apiClient.get('/user/languages');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}