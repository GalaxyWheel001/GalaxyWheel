import type { Context } from "https://edge.netlify.com";

// Маппинг стран в языки
const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  // Европа
  AZ: "az", RU: "ru", TR: "tr", DE: "de", FR: "fr", ES: "es", PT: "pt",
  // Америка
  US: "en", BR: "pt", MX: "es", AR: "es", CL: "es",
  // Азия
  CN: "zh", JP: "ja", KR: "ko"
};

export default async (request: Request, context: Context) => {
  const host = request.headers.get("host") || "";
  const userAgent = request.headers.get("user-agent") || "";
  const country = (context.geo?.country?.code || "").toUpperCase();

  // Кастомный домен — пропускаем
  if (host.endsWith("galaxy-casino.live")) {
    return context.next();
  }

  // Бот или пустой UA
  const isBot =
    !userAgent ||
    /bot|crawl|spider|facebookexternalhit|slurp|mediapartners|adsbot|bingpreview|twitterbot|linkedinbot|embedly|quora|pinterest|crawler|python-requests|axios|wget|fetch/i
      .test(userAgent);

  if (isBot) {
    return Response.redirect("https://yalanyok.tilda.ws/913", 302);
  }

  // Язык по IP
  const lang = COUNTRY_TO_LANGUAGE[country] || "en";

  // Редирект на языковую версию
  return Response.redirect(`https://galaxy-casino.live/${lang}/`, 302);
};
