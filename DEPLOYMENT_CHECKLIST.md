# ✅ ЧЕК-ЛИСТ ПЕРЕД ДЕПЛОЕМ НА NETLIFY

## 📁 Структура файлов (должна быть такой)

```
netlify/
├── edge-functions/
│   └── bot-redirect.ts          # ЕДИНСТВЕННАЯ Edge Function
└── edge-lib/
    ├── bot-detector.ts          # Библиотека для определения ботов
    └── redirect-config.ts       # Конфигурация редиректов
```

## 🔧 Критические файлы для деплоя

- ✅ `netlify.toml` - конфигурация сборки и Edge Functions
- ✅ `package.json` - зависимости и скрипты
- ✅ `next.config.js` - конфигурация Next.js
- ✅ `tsconfig.json` - конфигурация TypeScript
- ✅ `.nvmrc` - версия Node.js (18.18.0)
- ✅ `.npmrc` - настройки npm
- ✅ `src/` - исходный код приложения
- ✅ `public/` - статические файлы

## 🚫 Что НЕ должно быть в репозитории

- ❌ `node_modules/` (добавлено в .gitignore)
- ❌ `.next/` (добавлено в .gitignore)
- ❌ `netlify/edge-functions/bot-detector.ts` (удалено)
- ❌ `netlify/edge-functions/redirect-config.ts` (удалено)

## 🚀 Команды для загрузки в репозиторий

```bash
# Инициализация Git (если нужно)
git init

# Добавление всех файлов (кроме .gitignore)
git add .

# Коммит
git commit -m "Fix Netlify Edge Functions: move helpers to edge-lib"

# Привязка к удаленному репозиторию
git remote add origin <YOUR_REPO_URL>

# Пуш
git push -u origin main
```

## ⚙️ Настройки в Netlify

### Environment Variables (добавить в Site settings → Environment variables):
```
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE
NEXT_TELEMETRY_DISABLED=1
NODE_OPTIONS=--max-old-space-size=4096
```

### Build settings (должны быть автоматически из netlify.toml):
- Build command: `npm install --no-audit --no-fund && npm run build`
- Publish directory: `.next`
- Node version: `18.18.0`

## 🔍 Проверка после деплоя

### 1. Edge Functions
В логах деплоя должно быть:
```
Edge Functions bundling
Packaging Edge Functions from netlify/edge-functions directory:
- bot-redirect
```

### 2. Тестирование редиректов
```bash
# Бот (должен редиректить на yalanyok.tilda.ws/913)
curl -I https://yalanyok.netlify.app -H "User-Agent: "

# Реальный пользователь (должен редиректить на galaxy-casino.live)
curl -I https://yalanyok.netlify.app -H "User-Agent: Mozilla/5.0"

# Прямой доступ (должен открываться без редиректа)
curl -I https://galaxy-casino.live
```

## ❌ Если деплой падает

1. **Ошибка "Default export must be a function"**
   - Убедитесь, что в `netlify/edge-functions/` только `bot-redirect.ts`
   - Удалите старые файлы из репозитория: `git rm netlify/edge-functions/bot-detector.ts netlify/edge-functions/redirect-config.ts`

2. **Ошибка сборки**
   - Проверьте, что `npm run build` проходит локально
   - Убедитесь, что все зависимости в `package.json`

3. **Edge Functions не работают**
   - Проверьте конфигурацию в `netlify.toml`
   - Убедитесь, что функция `bot-redirect` активна в Netlify dashboard
