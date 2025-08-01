import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/utils/appwrite';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (result.success) {
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 