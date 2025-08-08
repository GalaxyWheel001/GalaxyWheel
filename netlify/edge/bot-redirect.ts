import { Context } from "https://edge.netlify.com";
import { isBot } from "../edge-lib/bot-detector.ts";
import { REDIRECTS } from "../edge-lib/redirect-config.ts";

export default async function handler(request: Request, context: Context) {
  const host = request.headers.get("host") || "";
  const userAgentHeader = request.headers.get("user-agent");
  const userAgent = userAgentHeader || "";

  if (host.endsWith("galaxy-casino.live")) {
    return context.next();
  }

  if (!userAgentHeader || isBot(userAgent)) {
    return Response.redirect(REDIRECTS.bot.url, REDIRECTS.bot.status);
  }

  return Response.redirect(REDIRECTS.user.url, REDIRECTS.user.status);
}
