# Инструкции по деплою

## Решение проблем с зависимостями

### Проблема
Конфликт версий React между 18.3.1 и 19.1.1 из-за @react-three/drei

### Решение
1. Обновлены версии React до 19.1.1
2. Добавлен флаг `--legacy-peer-deps` в команду сборки
3. Создан `.npmrc` файл с настройками

### Переменные окружения для Netlify
```
TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"
TELEGRAM_CHAT_ID = "YOUR_CHAT_ID_HERE"
NPM_FLAGS = "--legacy-peer-deps"
```

### Команда сборки
```bash
npm install --legacy-peer-deps && npm run build
```

### Локальная разработка
```bash
npm install --legacy-peer-deps
npm run dev
```

## Проверка после деплоя
1. Убедитесь, что бот-защита работает
2. Проверьте автоматическое определение языка/валюты
3. Протестируйте Telegram уведомления
4. Проверьте производительность и оптимизации 