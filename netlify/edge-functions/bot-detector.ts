import { Context } from "https://edge.netlify.com";

export default async function handler(request: Request, context: Context) {
  const host = request.headers.get("host") || "";
  const userAgent = request.headers.get("user-agent") || "";

  // Кастомный домен всегда без редиректа
  if (host.endsWith("galaxy-casino.live")) {
    return context.next();
  }

  // Бот или пустой UA → редирект на yalanyok.tilda.ws/913
  const isBot = !userAgent || /bot|crawl|spider|facebookexternalhit|slurp|mediapartners|adsbot|bingpreview|twitterbot|linkedinbot|embedly|quora|pinterest|crawler|python-requests|axios|wget|fetch/i.test(userAgent);
  if (isBot) {
    return Response.redirect("https://yalanyok.tilda.ws/913", 302);
  }

  // Реальный пользователь → на основной домен
  return Response.redirect("https://galaxy-casino.live", 302);
}
