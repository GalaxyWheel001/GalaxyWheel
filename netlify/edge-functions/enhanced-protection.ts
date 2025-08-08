// Дополнительные методы защиты от сканеров

export interface ProtectionResult {
  isSuspicious: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
  shouldBlock: boolean;
}

// Список подозрительных IP (опционально)
const SUSPICIOUS_IPS: string[] = [
  // Добавьте сюда IP адреса известных сканеров
  // '1.2.3.4',
  // '5.6.7.8'
];

// Список подозрительных паттернов в заголовках
const SUSPICIOUS_HEADERS: {
  missing: string[];
  suspicious: Record<string, string[]>;
} = {
  // Отсутствие стандартных заголовков
  missing: ['accept', 'accept-language', 'accept-encoding', 'user-agent'],
  
  // Подозрительные значения
  suspicious: {
    'user-agent': ['bot', 'crawler', 'spider', 'scraper', 'headless', 'phantom', 'selenium'],
    'accept': ['*/*', 'text/plain', 'application/json'],
    'accept-language': ['*', 'en-US,en;q=0'],
    'accept-encoding': ['identity', ''],
    'connection': ['close'],
    'upgrade-insecure-requests': [''],
    'sec-fetch-dest': [''],
    'sec-fetch-mode': [''],
    'sec-fetch-site': [''],
    'sec-ch-ua': [''],
    'sec-ch-ua-mobile': [''],
    'sec-ch-ua-platform': ['']
  }
};

// Проверка подозрительных паттернов в заголовках
export function analyzeHeaders(headers: Record<string, string>): ProtectionResult {
  const reasons: string[] = [];
  let riskScore = 0;
  
  // Проверка отсутствующих заголовков
  for (const header of SUSPICIOUS_HEADERS.missing) {
    if (!headers[header] || headers[header].trim() === '') {
      reasons.push(`Missing ${header} header`);
      riskScore += 15;
    }
  }
  
  // Проверка подозрительных значений
  for (const [header, suspiciousValues] of Object.entries(SUSPICIOUS_HEADERS.suspicious)) {
    const value = headers[header]?.toLowerCase() || '';
    
    for (const suspiciousValue of suspiciousValues) {
      if (value.includes(suspiciousValue)) {
        reasons.push(`Suspicious ${header} value: ${value}`);
        riskScore += 20;
      }
    }
  }
  
  // Проверка длины заголовков
  const userAgent = headers['user-agent'] || '';
  if (userAgent.length < 20) {
    reasons.push('User-Agent too short');
    riskScore += 25;
  }
  
  if (userAgent.length > 500) {
    reasons.push('User-Agent too long');
    riskScore += 20;
  }
  
  // Проверка на отсутствие современных заголовков браузера
  const modernHeaders: string[] = ['sec-ch-ua', 'sec-fetch-dest', 'sec-fetch-mode', 'sec-fetch-site'];
  const hasModernHeaders = modernHeaders.some(header => headers[header]);
  
  if (!hasModernHeaders) {
    reasons.push('Missing modern browser headers');
    riskScore += 30;
  }
  
  // Определение уровня риска
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 30) riskLevel = 'medium';
  
  return {
    isSuspicious: riskScore > 0,
    riskLevel,
    reasons,
    shouldBlock: riskScore >= 50
  };
}

// Проверка подозрительных IP
export function analyzeIP(ip: string): ProtectionResult {
  const reasons: string[] = [];
  let riskScore = 0;
  
  // Проверка по черному списку
  if (SUSPICIOUS_IPS.includes(ip)) {
    reasons.push('IP in suspicious list');
    riskScore += 100;
  }
  
  // Проверка на localhost/private IP
  if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    reasons.push('Private/localhost IP');
    riskScore += 40;
  }
  
  // Проверка на нестандартные IP форматы
  if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
    reasons.push('Invalid IP format');
    riskScore += 30;
  }
  
  return {
    isSuspicious: riskScore > 0,
    riskLevel: riskScore >= 50 ? 'high' : riskScore >= 20 ? 'medium' : 'low',
    reasons,
    shouldBlock: riskScore >= 50
  };
}

// Проверка поведения запроса
export function analyzeRequestBehavior(request: Request): ProtectionResult {
  const reasons: string[] = [];
  let riskScore = 0;
  
  const url = new URL(request.url);
  
  // Проверка метода запроса
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    reasons.push(`Unusual request method: ${request.method}`);
    riskScore += 30;
  }
  
  // Проверка на подозрительные пути
  const suspiciousPaths: string[] = ['/admin', '/wp-admin', '/phpmyadmin', '/cpanel', '/.env', '/config'];
  for (const path of suspiciousPaths) {
    if (url.pathname.toLowerCase().includes(path)) {
      reasons.push(`Suspicious path: ${url.pathname}`);
      riskScore += 40;
    }
  }
  
  // Проверка на подозрительные параметры
  const suspiciousParams: string[] = ['sql', 'script', 'eval', 'exec', 'system'];
  for (const param of suspiciousParams) {
    if (url.search.toLowerCase().includes(param)) {
      reasons.push(`Suspicious parameter: ${param}`);
      riskScore += 50;
    }
  }
  
  // Проверка referer
  const referer = request.headers.get('referer') || '';
  if (referer && !referer.startsWith('http')) {
    reasons.push('Invalid referer format');
    riskScore += 20;
  }
  
  return {
    isSuspicious: riskScore > 0,
    riskLevel: riskScore >= 50 ? 'high' : riskScore >= 20 ? 'medium' : 'low',
    reasons,
    shouldBlock: riskScore >= 40
  };
}

// Комплексная проверка
export function performEnhancedProtection(request: Request): ProtectionResult {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') || 
             '127.0.0.1';
  
  // Выполняем все проверки
  const headerAnalysis = analyzeHeaders(headers);
  const ipAnalysis = analyzeIP(ip);
  const behaviorAnalysis = analyzeRequestBehavior(request);
  
  // Объединяем результаты
  const allReasons = [
    ...headerAnalysis.reasons,
    ...ipAnalysis.reasons,
    ...behaviorAnalysis.reasons
  ];
  
  const totalRiskScore = 
    (headerAnalysis.shouldBlock ? 50 : 0) +
    (ipAnalysis.shouldBlock ? 50 : 0) +
    (behaviorAnalysis.shouldBlock ? 50 : 0);
  
  const isSuspicious = headerAnalysis.isSuspicious || ipAnalysis.isSuspicious || behaviorAnalysis.isSuspicious;
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (totalRiskScore >= 100) riskLevel = 'high';
  else if (totalRiskScore >= 50) riskLevel = 'medium';
  
  return {
    isSuspicious,
    riskLevel,
    reasons: allReasons,
    shouldBlock: totalRiskScore >= 80
  };
}

// Функция для логирования подозрительной активности
export function logSuspiciousActivity(result: ProtectionResult, request: Request): void {
  if (result.isSuspicious) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const url = request.url;
    
    console.log('🚨 Suspicious Activity Detected:', {
      ip,
      userAgent: userAgent.substring(0, 100),
      url,
      riskLevel: result.riskLevel,
      reasons: result.reasons,
      shouldBlock: result.shouldBlock,
      timestamp: new Date().toISOString()
    });
  }
}
