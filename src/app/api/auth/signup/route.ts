// app/api/auth/signup/route.ts
import { apiClient } from '@/app/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await apiClient.post('/user/auth/signup', body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}