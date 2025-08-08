// Улучшенная система определения ботов для Netlify Edge Functions

export interface BotDetectionResult {
  isBot: boolean;
  botType?: string;
  confidence: number;
  reasons: string[];
  country?: string;
  ip?: string;
}

export interface GeoIPResult {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  ip: string;
}

// Список разрешенных стран
const ALLOWED_COUNTRIES: string[] = ['AZ', 'RU', 'KZ', 'UA', 'BY', 'UZ', 'AM', 'GE', 'MD', 'RO', 'BG', 'HR', 'SI', 'SK', 'CZ', 'PL', 'HU', 'EE', 'LV', 'LT', 'MT', 'CY', 'GR', 'IT', 'ES', 'PT', 'FR', 'BE', 'NL', 'DE', 'AT', 'CH', 'LI', 'LU', 'MC', 'AD', 'GB', 'IE', 'IS', 'NO', 'SE', 'DK', 'FI', 'AL', 'MK', 'RS', 'ME', 'BA', 'XK', 'TR'];

// Известные боты
const BOT_PATTERNS: Record<string, string[]> = {
  // Поисковые боты
  search: [
    'googlebot', 'bingbot', 'yandex', 'baiduspider', 'sogou', 'duckduckbot', 
    'slurp', 'exabot', 'mj12bot', 'dotbot', 'gigabot', 'semrushbot', 'ahrefsbot', 
    'petalbot', 'seznambot', 'ia_archiver', 'archive.org_bot', 'rogerbot'
  ],
  
  // Социальные боты
  social: [
    'facebookexternalhit', 'facebookcatalog', 'facebookbot', 'instagram-bot', 
    'whatsapp-bot', 'telegram-bot', 'vk-bot', 'vkcom', 'twitterbot', 'linkedinbot', 
    'pinterest', 'tiktok', 'snapchat', 'discordbot', 'slackbot', 'skypebot'
  ],
  
  // Рекламные боты
  advertising: [
    'adsbot', 'adwords', 'google-adwords', 'bingads', 'facebookads', 'doubleclick', 
    'googleadwords', 'google-analytics', 'gtmetrix', 'pingdom', 'uptimerobot', 
    'statuscake', 'monitor', 'adwordsbot', 'bingadsbot', 'facebookadsbot', 
    'googleadsbot', 'yandexads', 'yandex-direct'
  ],
  
  // Автоматизированные инструменты
  automation: [
    'headless', 'phantomjs', 'selenium', 'webdriver', 'chromedriver', 'geckodriver', 
    'safaridriver', 'edgedriver', 'chromium', 'puppeteer', 'playwright'
  ],
  
  // Скрипты и утилиты
  script: [
    'curl', 'wget', 'python', 'java', 'perl', 'ruby', 'php', 'go', 'node', 'npm', 'yarn', 'bun'
  ],
  
  // Общие паттерны
  generic: ['bot', 'crawler', 'spider', 'scraper', 'scanner']
};

// Получение GeoIP информации
export async function getGeoIPInfo(request: Request): Promise<GeoIPResult> {
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   request.headers.get('cf-connecting-ip') || 
                   '127.0.0.1';
  
  // Сначала пробуем использовать встроенные заголовки Netlify
  const netlifyCountry = request.headers.get('x-country') || 
                        request.headers.get('x-vercel-ip-country');
  
  if (netlifyCountry) {
    return {
      country: netlifyCountry,
      countryCode: netlifyCountry,
      ip: clientIP
    };
  }
  
  // Если нет встроенных заголовков, используем внешний API
  try {
    const response = await fetch(`https://ipapi.co/${clientIP}/json/`, {
      headers: {
        'User-Agent': 'GalaxyWheel-BotDetector/1.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'XX',
        region: data.region,
        city: data.city,
        ip: clientIP
      };
    }
  } catch (error) {
    console.error('GeoIP API error:', error);
  }
  
  // Fallback
  return {
    country: 'Unknown',
    countryCode: 'XX',
    ip: clientIP
  };
}

// Определение бота
export function detectBot(userAgent: string, headers: Record<string, string>): BotDetectionResult {
  const ua = userAgent.toLowerCase();
  const reasons: string[] = [];
  let confidence = 0;
  let botType: string | undefined;

  // Проверка по паттернам
  for (const [type, patterns] of Object.entries(BOT_PATTERNS)) {
    if (patterns.some(pattern => ua.includes(pattern))) {
      botType = type;
      confidence += type === 'search' ? 80 : 
                   type === 'social' ? 75 : 
                   type === 'advertising' ? 85 : 
                   type === 'automation' ? 70 : 
                   type === 'script' ? 60 : 50;
      reasons.push(`${type} bot pattern detected`);
      break;
    }
  }

  // Проверка заголовков
  const accept = headers['accept'] || '';
  const acceptLanguage = headers['accept-language'] || '';
  const acceptEncoding = headers['accept-encoding'] || '';
  const referer = headers['referer'] || '';

  // Отсутствие стандартных заголовков браузера
  if (!accept.includes('text/html')) {
    confidence += 30;
    reasons.push('Missing HTML accept header');
  }

  if (!acceptLanguage) {
    confidence += 20;
    reasons.push('Missing accept-language header');
  }

  if (!acceptEncoding) {
    confidence += 20;
    reasons.push('Missing accept-encoding header');
  }

  // Проверка длины user-agent
  if (ua.length < 20) {
    confidence += 40;
    reasons.push('Suspiciously short user-agent');
  }

  if (ua.length > 500) {
    confidence += 30;
    reasons.push('Suspiciously long user-agent');
  }

  // Проверка на подозрительные паттерны
  if (ua.includes('headless') || ua.includes('phantom') || ua.includes('selenium')) {
    confidence += 60;
    reasons.push('Headless browser detected');
  }

  // Проверка на отсутствие JavaScript поддержки
  if (!headers['sec-ch-ua'] && !headers['sec-fetch-dest']) {
    confidence += 25;
    reasons.push('Missing modern browser headers');
  }

  return {
    isBot: confidence >= 50,
    botType,
    confidence: Math.min(confidence, 100),
    reasons
  };
}

// Проверка разрешенной страны
export function isAllowedCountry(countryCode: string): boolean {
  return ALLOWED_COUNTRIES.includes(countryCode.toUpperCase());
}

// Основная функция определения
export async function analyzeRequest(request: Request): Promise<BotDetectionResult> {
  const userAgent = request.headers.get('user-agent') || '';
  const headers: Record<string, string> = {};
  
  // Собираем все заголовки
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Получаем GeoIP информацию
  const geoInfo = await getGeoIPInfo(request);
  
  // Определяем бота
  const botResult = detectBot(userAgent, headers);
  
  return {
    ...botResult,
    country: geoInfo.countryCode,
    ip: geoInfo.ip
  };
}


