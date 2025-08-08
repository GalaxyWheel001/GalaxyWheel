export function isBot(userAgent: string): boolean {
  if (!userAgent) return false;

  const botRegex =
    /bot|crawl|spider|facebookexternalhit|slurp|mediapartners|adsbot|bingpreview|twitterbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|crawler|python-requests|axios|wget|fetch/i;

  return botRegex.test(userAgent);
}