import { apiClient, type SavedSpeaker } from '@/app/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await apiClient.get<{ savedSpeakers: SavedSpeaker[] }>('/conversation/speakers/saved');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}