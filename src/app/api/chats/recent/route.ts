import { apiClient, type RecentChat } from '@/app/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await apiClient.get<{ recentChats: RecentChat[] }>('/conversation/chats/recent');
    return NextResponse.json({
      success: true,
      data: data.recentChats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}