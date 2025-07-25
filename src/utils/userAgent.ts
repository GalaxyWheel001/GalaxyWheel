export interface ParsedUserAgent {
  device: string;
  os: string;
  browser: string;
}

export function parseUserAgent(ua: string): ParsedUserAgent {
  let device = 'Unknown';
  let os = 'Unknown';
  let browser = 'Unknown';

  // Device
  if (/mobile/i.test(ua)) device = 'Mobile';
  if (/tablet/i.test(ua)) device = 'Tablet';
  if (/desktop/i.test(ua) || (!/mobile/i.test(ua) && !/tablet/i.test(ua))) device = 'Desktop';

  // OS
  if (/windows nt 10/i.test(ua)) os = 'Windows 11/10';
  else if (/windows nt 6.3/i.test(ua)) os = 'Windows 8.1';
  else if (/windows nt 6.2/i.test(ua)) os = 'Windows 8';
  else if (/windows nt 6.1/i.test(ua)) os = 'Windows 7';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/ios|iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  // Browser
  const edge = ua.match(/edg\/([\d.]+)/i);
  const chrome = ua.match(/chrome\/([\d.]+)/i);
  const firefox = ua.match(/firefox\/([\d.]+)/i);
  const safari = ua.match(/safari\/([\d.]+)/i);

  if (edge) browser = `Edge ${edge[1]}`;
  else if (chrome && !/edg/i.test(ua)) browser = `Chrome ${chrome[1]}`;
  else if (firefox) browser = `Firefox ${firefox[1]}`;
  else if (safari && !/chrome/i.test(ua)) browser = `Safari ${safari[1]}`;

  return { device, os, browser };
}