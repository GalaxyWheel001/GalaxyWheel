import { NextRequest } from 'next/server';
import { sendTelegramMessage } from '@/utils/telegram';

export async function POST(req: NextRequest) {
  try {
    const { events } = await req.json();

    if (!events || !Array.isArray(events)) {
      return new Response(JSON.stringify({ error: 'Invalid events data' }), { status: 400 });
    }

    // Обрабатываем события аналитики
    for (const event of events) {
      const { event: eventType, userId, data } = event;

      // Отправляем важные события в Telegram
      if (eventType === 'error' || eventType === 'performance') {
        const message = `*Analytics Event*\n\n*Type:* ${eventType}\n*User:* ${userId}\n*Data:* ${JSON.stringify(data, null, 2)}`;
        await sendTelegramMessage(message);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Analytics API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
} 