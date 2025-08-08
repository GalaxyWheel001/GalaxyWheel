# 🧪 Примеры тестирования системы клоакинга

## 📋 Обзор тестов

Этот файл содержит примеры команд и сценариев для тестирования системы клоакинга Galaxy Wheel.

## 🤖 Тестирование определения ботов

### 1. Поисковые боты

```bash
# Googlebot
curl -H "User-Agent: Googlebot/2.1 (+http://www.google.com/bot.html)" \
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
     https://your-site.netlify.app

# Bingbot
curl -H "User-Agent: Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" \
     https://your-site.netlify.app

# Yandex
curl -H "User-Agent: Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)" \
     https://your-site.netlify.app

# Baidu
curl -H "User-Agent: Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)" \
     https://your-site.netlify.app
```

**Ожидаемый результат**: Редирект на `https://www.gamixlabs.com/blog.html`

### 2. Социальные боты

```bash
# Facebook
curl -H "User-Agent: facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" \
     https://your-site.netlify.app

# Twitter
curl -H "User-Agent: Twitterbot/1.0" \
     https://your-site.netlify.app

# LinkedIn
curl -H "User-Agent: LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)" \
     https://your-site.netlify.app
```

**Ожидаемый результат**: Редирект на `https://www.gamixlabs.com/blog.html`

### 3. Инструменты и скрипты

```bash
# curl
curl -H "User-Agent: curl/7.68.0" \
     https://your-site.netlify.app

# wget
curl -H "User-Agent: Wget/1.20.3 (linux-gnu)" \
     https://your-site.netlify.app

# Python requests
curl -H "User-Agent: python-requests/2.25.1" \
     https://your-site.netlify.app

# Selenium
curl -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 (selenium)" \
     https://your-site.netlify.app
```

**Ожидаемый результат**: Редирект на `https://www.gamixlabs.com/blog.html`

### 4. Подозрительные заголовки

```bash
# Отсутствие Accept заголовка
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     https://your-site.netlify.app

# Подозрительный Accept
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     -H "Accept: */*" \
     https://your-site.netlify.app

# Отсутствие Accept-Language
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
     https://your-site.netlify.app
```

**Ожидаемый результат**: Редирект на `https://www.gamixlabs.com/blog.html`

## 🌍 Тестирование GeoIP фильтрации

### 1. Разрешенные страны

```bash
# Россия (должен пройти проверку)
curl -H "X-Forwarded-For: 5.45.207.0" \
     -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
     -H "Accept-Language: ru-RU,ru;q=0.9,en;q=0.8" \
     -H "Accept-Encoding: gzip, deflate, br" \
     https://your-site.netlify.app

# Азербайджан (должен пройти проверку)
curl -H "X-Forwarded-For: 5.45.207.0" \
     -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
     -H "Accept-Language: az-AZ,az;q=0.9,en;q=0.8" \
     -H "Accept-Encoding: gzip, deflate, br" \
     https://your-site.netlify.app
```

**Ожидаемый результат**: JS Challenge или редирект на `https://galaxy-casino.live` (если есть кука)

### 2. Неразрешенные страны

```bash
# США (должен быть заблокирован)
curl -H "X-Forwarded-For: 8.8.8.8" \
     -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
     -H "Accept-Language: en-US,en;q=0.9" \
     -H "Accept-Encoding: gzip, deflate, br" \
     https://your-site.netlify.app

# Китай (должен быть заблокирован)
curl -H "X-Forwarded-For: 114.114.114.114" \
     -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
     -H "Accept-Language: zh-CN,zh;q=0.9" \
     -H "Accept-Encoding: gzip, deflate, br" \
     https://your-site.netlify.app
```

**Ожидаемый результат**: Редирект на `https://www.gamixlabs.com/blog.html`

## 🔒 Тестирование JavaScript Challenge

### 1. Первый визит (без куки)

```bash
# Реальный браузерный запрос
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" \
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" \
     -H "Accept-Language: ru-RU,ru;q=0.9,en;q=0.8" \
     -H "Accept-Encoding: gzip, deflate, br" \
     -H "DNT: 1" \
     -H "Connection: keep-alive" \
     -H "Upgrade-Insecure-Requests: 1" \
     -H "Sec-Fetch-Dest: document" \
     -H "Sec-Fetch-Mode: navigate" \
     -H "Sec-Fetch-Site: none" \
     -H "Sec-Fetch-User: ?1" \
     -H "Sec-Ch-Ua: \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\", \";Not A Brand\";v=\"99\"" \
     -H "Sec-Ch-Ua-Mobile: ?0" \
     -H "Sec-Ch-Ua-Platform: \"Windows\"" \
     -H "X-Forwarded-For: 5.45.207.0" \
     https://your-site.netlify.app
```

**Ожидаемый результат**: HTML страница JS Challenge

### 2. Повторный визит (с кукой)

```bash
# С кукой galaxy_visited=true
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" \
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" \
     -H "Accept-Language: ru-RU,ru;q=0.9,en;q=0.8" \
     -H "Accept-Encoding: gzip, deflate, br" \
     -H "Cookie: galaxy_visited=true" \
     -H "X-Forwarded-For: 5.45.207.0" \
     https://your-site.netlify.app
```

**Ожидаемый результат**: Редирект на `https://galaxy-casino.live`

## 🛡️ Тестирование дополнительной защиты

### 1. Подозрительные пути

```bash
# Попытка доступа к админке
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     https://your-site.netlify.app/admin

# Попытка доступа к конфигурации
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     https://your-site.netlify.app/.env

# Попытка доступа к WordPress
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     https://your-site.netlify.app/wp-admin
```

**Ожидаемый результат**: Редирект на `https://www.gamixlabs.com/blog.html`

### 2. Подозрительные параметры

```bash
# SQL инъекция
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     "https://your-site.netlify.app/?id=1' OR '1'='1"

# XSS атака
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     "https://your-site.netlify.app/?q=<script>alert('xss')</script>"

# Команда выполнения
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     "https://your-site.netlify.app/?cmd=ls"
```

**Ожидаемый результат**: Редирект на `https://www.gamixlabs.com/blog.html`

### 3. Нестандартные методы запроса

```bash
# POST запрос
curl -X POST \
     -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     https://your-site.netlify.app

# PUT запрос
curl -X PUT \
     -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     https://your-site.netlify.app

# DELETE запрос
curl -X DELETE \
     -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     https://your-site.netlify.app
```

**Ожидаемый результат**: Редирект на `https://www.gamixlabs.com/blog.html`

## 🧪 Автоматизированное тестирование

### Скрипт для массового тестирования

```bash
#!/bin/bash

SITE_URL="https://your-site.netlify.app"

echo "🧪 Начинаем тестирование системы клоакинга..."
echo "================================================"

# Тест 1: Googlebot
echo "1. Тестируем Googlebot..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "User-Agent: Googlebot/2.1 (+http://www.google.com/bot.html)" \
  "$SITE_URL")
echo "   Код ответа: $RESPONSE"

# Тест 2: Реальный браузер
echo "2. Тестируем реальный браузер..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
  -H "Accept-Language: ru-RU,ru;q=0.9,en;q=0.8" \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "X-Forwarded-For: 5.45.207.0" \
  "$SITE_URL")
echo "   Код ответа: $RESPONSE"

# Тест 3: Подозрительный IP
echo "3. Тестируем подозрительный IP..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "X-Forwarded-For: 8.8.8.8" \
  "$SITE_URL")
echo "   Код ответа: $RESPONSE"

# Тест 4: Подозрительный путь
echo "4. Тестируем подозрительный путь..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  "$SITE_URL/admin")
echo "   Код ответа: $RESPONSE"

echo "================================================"
echo "✅ Тестирование завершено!"
```

### Сохранение скрипта

```bash
# Сохраните скрипт как test-cloaking.sh
chmod +x test-cloaking.sh
./test-cloaking.sh
```

## 📊 Анализ результатов

### Коды ответов

- **200**: JS Challenge (для новых пользователей)
- **301/302**: Редирект на соответствующий сайт
- **404**: Статические файлы или ошибка

### Проверка заголовков

```bash
# Проверка заголовков ответа
curl -I -H "User-Agent: Googlebot/2.1" https://your-site.netlify.app

# Проверка редиректа
curl -L -H "User-Agent: Googlebot/2.1" https://your-site.netlify.app
```

### Проверка куки

```bash
# Проверка установки куки
curl -c cookies.txt -H "User-Agent: Mozilla/5.0" https://your-site.netlify.app
cat cookies.txt

# Использование сохраненной куки
curl -b cookies.txt -H "User-Agent: Mozilla/5.0" https://your-site.netlify.app
```

## 🔍 Отладка

### Включение подробных логов

```bash
# Подробный вывод curl
curl -v -H "User-Agent: Googlebot/2.1" https://your-site.netlify.app

# Проверка всех заголовков
curl -D - -H "User-Agent: Googlebot/2.1" https://your-site.netlify.app
```

### Проверка логов Netlify

1. Откройте Netlify Dashboard
2. Перейдите в Functions → Functions logs
3. Найдите логи для вашего сайта
4. Ищите сообщения с эмодзи (🔍, 🚫, 🔒, ✅)

## ⚠️ Важные замечания

1. **Замените `your-site.netlify.app`** на ваш реальный домен
2. **Тестируйте в разных браузерах** для проверки JS Challenge
3. **Используйте VPN** для тестирования GeoIP из разных стран
4. **Мониторьте логи** во время тестирования
5. **Не тестируйте на продакшене** без необходимости

## 📈 Метрики успеха

- **Боты**: 100% редирект на безопасный сайт
- **Реальные пользователи**: Успешное прохождение JS Challenge
- **GeoIP**: Корректная блокировка неразрешенных стран
- **Производительность**: Время ответа < 100ms
- **Логи**: Отсутствие ошибок в логах Edge Functions
