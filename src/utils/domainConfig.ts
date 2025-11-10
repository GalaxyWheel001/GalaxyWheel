// Конфигурация доменов для разных типов трафика

export interface DomainConfig {
  mainDomain: string;
  botDomains: {
    meta: string;
    ad: string;
    search: string;
    social: string;
    automation: string;
    script: string;
    default: string;
  };
  analytics: {
    enabled: boolean;
    trackingId?: string;
  };
  seo: {
    enabled: boolean;
    sitemapUrl?: string;
    robotsUrl?: string;
  };
}

// Основная конфигурация для вашего сайта
export const DOMAIN_CONFIG: DomainConfig = {
  mainDomain: 'https://casino-galaxy.bet',
  botDomains: {
    meta: 'https://yalanyokgaming.netlify.app/',
    ad: 'https://yalanyokgaming.netlify.app/', 
    search: 'https://yalanyokgaming.netlify.app/',
    social: 'https://yalanyokgaming.netlify.app/',
    automation: 'https://yalanyokgaming.netlify.app/',
    script: 'https://yalanyokgaming.netlify.app/',
    default: 'https://yalanyokgaming.netlify.app/'
  },
  analytics: {
    enabled: true,
    trackingId: 'GA_TRACKING_ID' // Замените на ваш ID
  },
  seo: {
    enabled: true,
    sitemapUrl: 'https://casino-galaxy.bet/sitemap.xml',
    robotsUrl: 'https://casino-galaxy.bet/robots.txt'
  }
};

// Функция для получения URL для ботов
export function getBotUrl(botType: string): string {
  return DOMAIN_CONFIG.botDomains[botType as keyof typeof DOMAIN_CONFIG.botDomains] || 
         DOMAIN_CONFIG.botDomains.default;
}

// Функция для проверки, является ли URL основным доменом
export function isMainDomain(url: string): boolean {
  return url.includes(DOMAIN_CONFIG.mainDomain);
}

// Функция для получения основного домена
export function getMainDomain(): string {
  return DOMAIN_CONFIG.mainDomain;
}

// Функция для обновления конфигурации
export function updateDomainConfig(newConfig: Partial<DomainConfig>): void {
  Object.assign(DOMAIN_CONFIG, newConfig);
} 