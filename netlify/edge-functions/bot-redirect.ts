// Основная Edge Function для клоакинга на Netlify

import { analyzeRequest, isAllowedCountry } from './bot-detector';
import { 
  getBotRedirectConfig, 
  getRealUserRedirectConfig, 
  createRedirectResponse,
  hasVisitedCookie,
  setVisitedCookie,
  DEFAULT_CLOAKING_CONFIG
} from './redirect-config';
import { performEnhancedProtection, logSuspiciousActivity } from './enhanced-protection';

// HTML для JS challenge
const JS_CHALLENGE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Required</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        h1 {
            margin: 0 0 20px 0;
            font-size: 24px;
            font-weight: 600;
        }
        p {
            margin: 0 0 30px 0;
            opacity: 0.9;
            line-height: 1.6;
        }
        .progress {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            height: 6px;
            margin: 20px 0;
            overflow: hidden;
        }
        .progress-bar {
            background: white;
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
        }
        .status {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 Security Verification</h1>
        <p>Please wait while we verify your browser...</p>
        
        <div class="spinner"></div>
        
        <div class="progress">
            <div class="progress-bar" id="progressBar"></div>
        </div>
        
        <div class="status" id="status">Initializing verification...</div>
    </div>

    <script>
        (function() {
            let progress = 0;
            const progressBar = document.getElementById('progressBar');
            const status = document.getElementById('status');
            
            const steps: Array<{progress: number, text: string}> = [
                { progress: 20, text: 'Checking browser compatibility...' },
                { progress: 40, text: 'Verifying JavaScript execution...' },
                { progress: 60, text: 'Validating user interaction...' },
                { progress: 80, text: 'Setting security tokens...' },
                { progress: 100, text: 'Redirecting to secure site...' }
            ];
            
            let currentStep = 0;
            
            function updateProgress() {
                if (currentStep < steps.length) {
                    const step = steps[currentStep];
                    progress = step.progress;
                    progressBar.style.width = progress + '%';
                    status.textContent = step.text;
                    currentStep++;
                    
                    if (currentStep < steps.length) {
                        setTimeout(updateProgress, 800 + Math.random() * 400);
                    } else {
                        setTimeout(completeVerification, 1000);
                    }
                }
            }
            
            function completeVerification() {
                // Устанавливаем куку
                document.cookie = '${DEFAULT_CLOAKING_CONFIG.cookieName}=true; path=/; max-age=${DEFAULT_CLOAKING_CONFIG.cookieMaxAge}; secure; samesite=lax';
                
                // Редиректим на основной сайт
                window.location.href = '${DEFAULT_CLOAKING_CONFIG.realUserRedirect}';
            }
            
            // Начинаем процесс через небольшую задержку
            setTimeout(updateProgress, 500);
            
            // Дополнительные проверки для отсеивания ботов
            let mouseMoved = false;
            let keyPressed = false;
            
            document.addEventListener('mousemove', () => { mouseMoved = true; });
            document.addEventListener('keydown', () => { keyPressed = true; });
            document.addEventListener('click', () => { mouseMoved = true; });
            
            // Проверяем поддержку современных браузерных API
            const hasModernAPIs = 
                typeof window !== 'undefined' &&
                typeof document !== 'undefined' &&
                typeof navigator !== 'undefined' &&
                typeof localStorage !== 'undefined' &&
                typeof sessionStorage !== 'undefined' &&
                typeof fetch !== 'undefined' &&
                typeof Promise !== 'undefined';
            
            if (!hasModernAPIs) {
                // Если нет поддержки современных API - редиректим как бота
                window.location.href = '${DEFAULT_CLOAKING_CONFIG.botRedirect}';
            }
            
            // Проверяем размер экрана (боты часто имеют нестандартные размеры)
            if (window.screen.width < 200 || window.screen.height < 200) {
                window.location.href = '${DEFAULT_CLOAKING_CONFIG.botRedirect}';
            }
            
            // Проверяем наличие плагинов (боты часто их не имеют)
            if (navigator.plugins.length === 0) {
                window.location.href = '${DEFAULT_CLOAKING_CONFIG.botRedirect}';
            }
            
        })();
    </script>
</body>
</html>
`;

// Основная функция обработки запросов
export default async function handler(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Пропускаем статические файлы и API
    if (path.startsWith('/_next/') || 
        path.startsWith('/api/') || 
        path.startsWith('/static/') ||
        path.includes('.') ||
        path === '/favicon.ico' ||
        path === '/robots.txt' ||
        path === '/sitemap.xml') {
      return new Response(null, { status: 404 });
    }
    
    // Анализируем запрос
    const analysis = await analyzeRequest(request);
    
    // Дополнительная защита от сканеров
    const protectionResult = performEnhancedProtection(request);
    logSuspiciousActivity(protectionResult, request);
    
    console.log('🔍 Request Analysis:', {
      path,
      isBot: analysis.isBot,
      botType: analysis.botType,
      confidence: analysis.confidence,
      country: analysis.country,
      ip: analysis.ip,
      reasons: analysis.reasons,
      protectionRisk: protectionResult.riskLevel,
      protectionReasons: protectionResult.reasons
    });
    
    // Если это бот или подозрительная активность - редиректим на ботовский сайт
    if (analysis.isBot || protectionResult.shouldBlock) {
      const botConfig = getBotRedirectConfig(analysis.botType || 'suspicious');
      console.log(`🚫 Redirecting ${analysis.isBot ? 'bot' : 'suspicious activity'} (${analysis.botType || 'suspicious'}) to: ${botConfig.url}`);
      return createRedirectResponse(botConfig);
    }
    
    // Проверяем страну
    if (analysis.country && !isAllowedCountry(analysis.country)) {
      console.log(`🌍 Country not allowed: ${analysis.country}, redirecting as bot`);
      const botConfig = getBotRedirectConfig('geo-blocked');
      return createRedirectResponse(botConfig);
    }
    
    // Проверяем куку visited
    if (hasVisitedCookie(request)) {
      console.log('✅ User has visited cookie, redirecting to main site');
      const userConfig = getRealUserRedirectConfig();
      return createRedirectResponse(userConfig);
    }
    
    // Если нет куки - показываем JS challenge
    console.log('🔒 Showing JS challenge for new user');
    return new Response(JS_CHALLENGE_HTML, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Challenge-Type': 'javascript',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff'
      }
    });
    
  } catch (error) {
    console.error('❌ Error in bot-redirect handler:', error);
    
    // В случае ошибки - редиректим как бота для безопасности
    const botConfig = getBotRedirectConfig('error');
    return createRedirectResponse(botConfig);
  }
}
