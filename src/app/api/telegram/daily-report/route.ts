import { NextRequest } from 'next/server';
import { telegramNotifier } from '@/utils/telegramEnhanced';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const result = await telegramNotifier.sendDailyReport({
      date: new Date(data.date || Date.now()),
      totalVisits: data.totalVisits || 0,
      totalSpins: data.totalSpins || 0,
      conversionRate: data.conversionRate || 0,
      topCountries: data.topCountries || [],
      revenue: data.revenue || '$0',
      newUsers: data.newUsers,
      returningUsers: data.returningUsers
    });
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to send daily report' }), { status: 500 });
    }
  } catch (error) {
    console.error('Daily report error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
} 