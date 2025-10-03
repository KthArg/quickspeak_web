import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    API_BASE_URL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'not set',
    hasApiKey: !!process.env.API_KEY || !!process.env.NEXT_PUBLIC_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}