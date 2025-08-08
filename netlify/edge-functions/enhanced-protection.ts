import { Context } from "https://edge.netlify.com";

export default async function handler(req: Request, context: Context) {
  const userAgent = req.headers.get("user-agent") || "";

  // Строгая проверка подозрительных User-Agent
  const isSuspicious = /(bot|crawler|spider|python|scrapy|curl|wget|httpclient)/i.test(userAgent);

  if (isSuspicious) {
    return new Response("Access denied: bot or scraper detected", { status: 403 });
  }

  // Можно расширить проверками по IP, рефереру, cookie и т.д.
  return context.next();
}
