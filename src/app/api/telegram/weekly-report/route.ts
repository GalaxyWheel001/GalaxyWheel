import { NextRequest } from 'next/server';
import { telegramNotifier } from '@/utils/telegramEnhanced';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const result = await telegramNotifier.sendWeeklyReport({
      week: data.week || 'Week 1',
      growth: data.growth || '+0%',
      newUsers: data.newUsers || 0,
      topPerformers: data.topPerformers || [],
      totalRevenue: data.totalRevenue || '$0',
      avgConversionRate: data.avgConversionRate || 0
    });
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to send weekly report' }), { status: 500 });
    }
  } catch (error) {
    console.error('Weekly report error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
} 