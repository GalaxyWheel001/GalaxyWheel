// Утилита для определения ботов

export interface BotDetectionResult {
  isBot: boolean;
  botType?: string;
  confidence: number;
  reasons: string[];
}

// Список известных ботов Meta/Facebook (только для сканирования)
const META_SCANNER_BOTS = [
  'facebookexternalhit',
  'facebookcatalog',
  'facebookbot',
  'instagram-bot',
  'whatsapp-bot',
  'telegram-bot',
  'vk-bot',
  'vkcom'
];

// Рекламные боты
const AD_BOTS = [
  'adsbot',
  'adwords',
  'google-adwords',
  'bingads',
  'facebookads',
  'doubleclick',
  'googleadwords',
  'google-analytics',
  'gtmetrix',
  'pingdom',
  'uptimerobot',
  'statuscake',
  'monitor',
  'adwordsbot',
  'bingadsbot',
  'facebookadsbot',
  'googleadsbot',
  'yandexads',
  'yandex-direct',
  'googleadwordsbot',
  'bingadsbot',
  'facebookadsbot',
  'googleadsbot',
  'yandexadsbot',
  'yandexdirectbot'
];

// Поисковые боты
const SEARCH_BOTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
  'sogou',
  'duckduckbot',
  'slurp',
  'exabot',
  'mj12bot',
  'dotbot',
  'gigabot',
  'semrushbot',
  'ahrefsbot',
  'petalbot',
  'seznambot',
  'ia_archiver',
  'archive.org_bot',
  'rogerbot'
];

// Социальные боты (только сканеры)
const SOCIAL_SCANNER_BOTS = [
  'twitterbot',
  'linkedinbot',
  'pinterest',
  'tiktok',
  'snapchat',
  'discordbot',
  'slackbot',
  'skypebot'
];

// Автоматизированные инструменты
const AUTOMATION_TOOLS = [
  'headless',
  'phantomjs',
  'selenium',
  'webdriver',
  'chromedriver',
  'geckodriver',
  'safaridriver',
  'edgedriver',
  'chromium',
  'puppeteer',
  'playwright'
];

// Скрипты и утилиты
const SCRIPT_TOOLS = [
  'curl',
  'wget',
  'python',
  'java',
  'perl',
  'ruby',
  'php',
  'go',
  'node',
  'npm',
  'yarn',
  'bun'
];

export function detectBot(userAgent: string, headers?: Record<string, string>): BotDetectionResult {
  const ua = userAgent.toLowerCase();
  const reasons: string[] = [];
  let confidence = 0;
  let botType: string | undefined;

  // Проверка на сканеры Meta/Facebook (не пользователи)
  if (META_SCANNER_BOTS.some(bot => ua.includes(bot))) {
    botType = 'meta';
    confidence += 90;
    reasons.push('Meta/Facebook scanner bot detected');
  }

  if (AD_BOTS.some(bot => ua.includes(bot))) {
    botType = 'ad';
    confidence += 85;
    reasons.push('Advertising bot detected');
  }

  if (SEARCH_BOTS.some(bot => ua.includes(bot))) {
    botType = 'search';
    confidence += 80;
    reasons.push('Search engine bot detected');
  }

  if (SOCIAL_SCANNER_BOTS.some(bot => ua.includes(bot))) {
    botType = 'social';
    confidence += 75;
    reasons.push('Social media scanner bot detected');
  }

  if (AUTOMATION_TOOLS.some(tool => ua.includes(tool))) {
    botType = 'automation';
    confidence += 70;
    reasons.push('Automation tool detected');
  }

  if (SCRIPT_TOOLS.some(tool => ua.includes(tool))) {
    botType = 'script';
    confidence += 60;
    reasons.push('Script/utility tool detected');
  }

  // Проверка на общие паттерны ботов
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
    confidence += 50;
    reasons.push('Generic bot pattern detected');
  }

  // Проверка заголовков
  if (headers) {
    const accept = headers['accept'] || '';
    const acceptLanguage = headers['accept-language'] || '';
    const acceptEncoding = headers['accept-encoding'] || '';

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

  return {
    isBot: confidence >= 50,
    botType,
    confidence: Math.min(confidence, 100),
    reasons
  };
}

// Функция для логирования обнаруженных ботов
export function logBotDetection(result: BotDetectionResult, userAgent: string) {
  if (result.isBot) {
    console.log(`🚫 Bot detected:`, {
      userAgent: userAgent.substring(0, 100),
      type: result.botType,
      confidence: result.confidence,
      reasons: result.reasons
    });
  }
}

// Функция для получения URL редиректа для ботов
export function getBotRedirectUrl(botType?: string): string {
  const redirects: Record<string, string> = {
    meta: 'https://yalanyokgaming.netlify.app/',
    ad: 'https://yalanyokgaming.netlify.app/',
    search: 'https://yalanyokgaming.netlify.app/',
    social: 'https://yalanyokgaming.netlify.app/',
    automation: 'https://yalanyokgaming.netlify.app/',
    script: 'https://yalanyokgaming.netlify.app/',
    default: 'https://yalanyokgaming.netlify.app/'
  };
  
  return redirects[botType || 'default'] || redirects.default;
} 