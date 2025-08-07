import { NextRequest, NextResponse } from 'next/server';
import { detectBot, logBotDetection } from '@/utils/botDetection';
import { getBotRedirectConfig } from '@/utils/botRedirects';
import { telegramNotifier } from '@/utils/telegramEnhanced';
import { getLocationByIp } from '@/utils/geolocation';

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  const referer = request.headers.get('referer') || '';
  
  // Собираем заголовки для анализа
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  // Проверяем, пришел ли пользователь с рекламы Meta
  const isFromMetaAds = 
    referer.includes('facebook.com') || 
    referer.includes('instagram.com') || 
    referer.includes('whatsapp.com') ||
    referer.includes('telegram.me') ||
    referer.includes('t.me');
  
  // Если пользователь пришел с рекламы - пропускаем (это реальный пользователь)
  if (isFromMetaAds) {
    console.log(`✅ Allowing user from Meta ads: ${referer}`);
    return NextResponse.next();
  }
  
  // Получаем IP пользователя
  const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
  // Определяем язык по IP
  let language = 'en';
  try {
    const geo = await getLocationByIp(ip);
    language = geo.language || 'en';
    console.log('🌍 Geo IP:', ip, 'Country:', geo.country_code, 'Language:', language);
  } catch (e) {
    // fallback
  }
  // Устанавливаем куку с языком всегда (даже если уже есть)
  const response = NextResponse.next();
  response.cookies.set('galaxy_wheel_language', language, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  
  // Дополнительные проверки для более точного определения ботов
  const isDefinitelyHuman = 
    userAgent.includes('Mozilla/5.0') && 
    userAgent.includes('Chrome') && 
    accept.includes('text/html') && 
    acceptLanguage && 
    acceptEncoding;
  
  // Если это точно человек - пропускаем
  if (isDefinitelyHuman) {
    return response;
  }
  
  // Определяем бота с помощью нашей утилиты
  const botResult = detectBot(userAgent, headers);
  
  // Логируем обнаруженных ботов
  logBotDetection(botResult, userAgent);
  
  // Если это бот - редиректим
  if (botResult.isBot) {
    const config = getBotRedirectConfig(botResult.botType);
    
    console.log(`🚫 Redirecting bot to: ${config.url}`);
    
    // Отправляем уведомление в Telegram о боте
    const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    telegramNotifier.sendBotDetectionNotification({
      userAgent,
      botType: botResult.botType || 'unknown',
      confidence: botResult.confidence,
      reasons: botResult.reasons,
      ip
    }).catch(error => {
      console.error('Failed to send bot notification:', error);
    });
    
    const response = NextResponse.redirect(config.url, {
      status: config.status as 301 | 302
    });
    
    // Добавляем дополнительные заголовки если есть
    if (config.headers) {
      Object.entries(config.headers as Record<string, string>).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    
    return response;
  }
  
  // Для обычных пользователей - продолжаем
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 