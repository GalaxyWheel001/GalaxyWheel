import { NextResponse } from 'next/server';
import { telegramNotifier } from '@/utils/telegramEnhanced';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const result = await telegramNotifier.sendAlert({
      type: data.type,
      message: data.message,
      threshold: data.threshold,
      current: data.current,
      ip: data.ip,
      count: data.count
    });

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error('Alert route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
