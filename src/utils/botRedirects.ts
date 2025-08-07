import { getBotUrl } from '@/utils/domainConfig';

// Конфигурация редиректов для ботов

export interface BotRedirectConfig {
  url: string;
  status: number;
  headers?: Record<string, string>;
}

// Настройки редиректов для ботов - ВСЕ боты уходят на внешний домен
export const BOT_REDIRECTS: Record<string, BotRedirectConfig> = {
  // Meta/Facebook боты - отправляем на внешний домен
  meta: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  },
  
  // Рекламные боты - отправляем на внешний домен
  ad: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  },
  
  // Поисковые боты - отправляем на внешний домен
  search: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  },
  
  // Социальные сети - отправляем на внешний домен
  social: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  },
  
  // Автоматизированные инструменты - отправляем на внешний домен
  automation: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  },
  
  // Скрипты и утилиты - отправляем на внешний домен
  script: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  },
  
  // Общие боты (по умолчанию) - отправляем на внешний домен
  default: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  }
};

// Функция для получения конфигурации редиректа
export function getBotRedirectConfig(botType?: string): BotRedirectConfig {
  if (botType && BOT_REDIRECTS[botType]) {
    return BOT_REDIRECTS[botType];
  }
  
  return BOT_REDIRECTS.default;
}

// Функция для обновления URL редиректов
export function updateBotRedirects(newRedirects: Partial<Record<string, BotRedirectConfig>>) {
  Object.assign(BOT_REDIRECTS, newRedirects);
}

// Функция для получения всех настроенных URL
export function getAllBotRedirectUrls(): Record<string, string> {
  const urls: Record<string, string> = {};
  
  Object.entries(BOT_REDIRECTS).forEach(([type, config]) => {
    urls[type] = config.url;
  });
  
  return urls;
} 