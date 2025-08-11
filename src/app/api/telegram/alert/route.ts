import { NextRequest } from 'next/server';
import { telegramNotifier } from '@/utils/telegramEnhanced';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const result = await telegramNotifier.sendAlert({
      type: data.type || 'system_error',
      message: data.message || 'Alert triggered',
      threshold: data.threshold,
      current: data.current,
      ip: data.ip,
      count: data.count
    });
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to send alert' }), { status: 500 });
    }
  } catch (error) {
    console.error('Alert error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
} 