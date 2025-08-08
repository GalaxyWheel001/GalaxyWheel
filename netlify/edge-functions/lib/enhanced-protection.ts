export interface ProtectionResult {
  isSuspicious: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
  shouldBlock: boolean;
}

const SUSPICIOUS_IPS: string[] = [];

const SUSPICIOUS_HEADERS: { missing: string[]; suspicious: Record<string, string[]> } = {
  missing: ['accept', 'accept-language', 'accept-encoding', 'user-agent'],
  suspicious: {
    'user-agent': ['bot', 'crawler', 'spider', 'scraper', 'headless', 'phantom', 'selenium'],
    'accept': ['*/*', 'text/plain', 'application/json']
  }
};

export function analyzeHeaders(headers: Record<string, string>): ProtectionResult {
  const reasons: string[] = [];
  let riskScore = 0;
  for (const header of SUSPICIOUS_HEADERS.missing) {
    if (!headers[header] || headers[header].trim() === '') {
      reasons.push(`Missing ${header} header`);
      riskScore += 15;
    }
  }
  for (const [header, suspiciousValues] of Object.entries(SUSPICIOUS_HEADERS.suspicious)) {
    const value = headers[header]?.toLowerCase() || '';
    for (const s of suspiciousValues) {
      if (value.includes(s)) {
        reasons.push(`Suspicious ${header} value: ${value}`);
        riskScore += 20;
      }
    }
  }
  const userAgent = headers['user-agent'] || '';
  if (userAgent.length < 20) { reasons.push('User-Agent too short'); riskScore += 25; }
  const modernHeaders: string[] = ['sec-ch-ua', 'sec-fetch-dest', 'sec-fetch-mode', 'sec-fetch-site'];
  const hasModern = modernHeaders.some(h => headers[h]);
  if (!hasModern) { reasons.push('Missing modern browser headers'); riskScore += 30; }
  return { isSuspicious: riskScore > 0, riskLevel: riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low', reasons, shouldBlock: riskScore >= 50 };
}

export function analyzeIP(ip: string): ProtectionResult {
  const reasons: string[] = [];
  let riskScore = 0;
  if (SUSPICIOUS_IPS.includes(ip)) { reasons.push('IP in suspicious list'); riskScore += 100; }
  if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) { reasons.push('Private/localhost IP'); riskScore += 40; }
  return { isSuspicious: riskScore > 0, riskLevel: riskScore >= 50 ? 'high' : riskScore >= 20 ? 'medium' : 'low', reasons, shouldBlock: riskScore >= 50 };
}

export function analyzeRequestBehavior(request: Request): ProtectionResult {
  const reasons: string[] = [];
  let riskScore = 0;
  const url = new URL(request.url);
  if (request.method !== 'GET' && request.method !== 'HEAD') { reasons.push(`Unusual request method: ${request.method}`); riskScore += 30; }
  const suspiciousPaths: string[] = ['/admin', '/wp-admin', '/phpmyadmin', '/cpanel', '/.env', '/config'];
  for (const p of suspiciousPaths) { if (url.pathname.toLowerCase().includes(p)) { reasons.push(`Suspicious path: ${url.pathname}`); riskScore += 40; } }
  return { isSuspicious: riskScore > 0, riskLevel: riskScore >= 50 ? 'high' : riskScore >= 20 ? 'medium' : 'low', reasons, shouldBlock: riskScore >= 40 };
}

export function performEnhancedProtection(request: Request): ProtectionResult {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => { headers[key] = value; });
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || '127.0.0.1';
  const h = analyzeHeaders(headers);
  const i = analyzeIP(ip);
  const b = analyzeRequestBehavior(request);
  const allReasons = [...h.reasons, ...i.reasons, ...b.reasons];
  const total = (h.shouldBlock ? 50 : 0) + (i.shouldBlock ? 50 : 0) + (b.shouldBlock ? 50 : 0);
  const isSuspicious = h.isSuspicious || i.isSuspicious || b.isSuspicious;
  const riskLevel: 'low' | 'medium' | 'high' = total >= 100 ? 'high' : total >= 50 ? 'medium' : 'low';
  return { isSuspicious, riskLevel, reasons: allReasons, shouldBlock: total >= 80 };
}

export function logSuspiciousActivity(result: ProtectionResult, request: Request): void {
  if (!result.isSuspicious) return;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  console.log('🚨 Suspicious Activity Detected:', { ip, userAgent: userAgent.substring(0, 100), url: request.url, riskLevel: result.riskLevel, reasons: result.reasons, shouldBlock: result.shouldBlock, timestamp: new Date().toISOString() });
}


