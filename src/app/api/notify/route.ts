import { NextRequest } from 'next/server';
import { telegramNotifier } from '@/utils/telegramEnhanced';
import { getLocationByIp } from '@/utils/geolocation';
import { parseUserAgent } from '@/utils/userAgent';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, userId } = body;

  if (!type || !userId) {
    return new Response(JSON.stringify({ error: 'Type and userId are required' }), { status: 400 });
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
  const userAgent = req.headers.get('user-agent') || 'Unknown';
  const { device, os, browser } = parseUserAgent(userAgent);
  const referrer = req.headers.get('referer') || undefined;

  try {
    let location;
    if (ip && ip !== '127.0.0.1') {
      try {
        location = await getLocationByIp(ip);
      } catch (e) {
        console.error('Location lookup failed:', e);
      }
    }

    const baseData = {
      userId,
      ip,
      location,
      device,
      os,
      browser,
      userAgent
    };

    let result;

    switch (type) {
      case 'visit':
        const { isNew } = body;
        result = await telegramNotifier.sendVisitNotification({
          ...baseData,
          isNew,
          referrer
        });
        telegramNotifier.updateStats('visit', { isNew });
        break;

      case 'spin':
        const { result: spinResult } = body;
        result = await telegramNotifier.sendSpinNotification({
          ...baseData,
          result: spinResult
        });
        telegramNotifier.updateStats('spin', spinResult);
        break;

      case 'conversion':
        const { result: conversionResult } = body;
        result = await telegramNotifier.sendConversionNotification({
          ...baseData,
          result: conversionResult
        });
        telegramNotifier.updateStats('conversion', conversionResult);
        break;

      case 'bot_detected':
        const { botType, confidence, reasons } = body;
        result = await telegramNotifier.sendBotDetectionNotification({
          userAgent,
          botType,
          confidence,
          reasons,
          ip
        });
        break;

      case 'error':
        const { error, context, stack } = body;
        result = await telegramNotifier.sendErrorNotification({
          error,
          context,
          userId,
          stack
        });
        break;

      case 'performance':
        const { metric, value, threshold } = body;
        result = await telegramNotifier.sendPerformanceNotification({
          metric,
          value,
          threshold,
          userId
        });
        break;

      case 'stats':
        const stats = telegramNotifier.getStats();
        result = await telegramNotifier.sendStatsNotification(stats);
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid event type' }), { status: 400 });
    }

    if (result.success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      console.error('Telegram notification failed:', result.error);
      return new Response(JSON.stringify({ error: 'Failed to send notification' }), { status: 500 });
    }

  } catch (error) {
    console.error('Notification processing error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}