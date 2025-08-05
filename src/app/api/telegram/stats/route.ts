import { NextRequest } from 'next/server';
import { telegramNotifier } from '@/utils/telegramEnhanced';

export async function POST(req: NextRequest) {
  try {
    const stats = telegramNotifier.getStats();
    const result = await telegramNotifier.sendStatsNotification(stats);
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true, stats }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to send stats' }), { status: 500 });
    }
  } catch (error) {
    console.error('Stats notification error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function GET() {
  try {
    const stats = telegramNotifier.getStats();
    return new Response(JSON.stringify({ success: true, stats }), { status: 200 });
  } catch (error) {
    console.error('Stats retrieval error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
} 