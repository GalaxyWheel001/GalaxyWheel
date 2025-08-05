import { NextRequest } from 'next/server';
import { telegramNotifier } from '@/utils/telegramEnhanced';

export async function POST(req: NextRequest) {
  try {
    const { text, buttons } = await req.json();
    
    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), { status: 400 });
    }

    const result = await telegramNotifier.sendInteractiveMessage(text, buttons || []);
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to send interactive message' }), { status: 500 });
    }
  } catch (error) {
    console.error('Interactive message error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
} 