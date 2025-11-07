# Архитектура авторизации

## Текущая реализация

### Подход: Single Access Token (JWT)

Сейчас используется **простой JWT подход** без refresh токенов.

### Как это работает:

```
┌─────────┐                 ┌──────────────┐                ┌──────────────┐
│ Client  │                 │ Auth Service │                │ Todos Service│
└────┬────┘                 └──────┬───────┘                └──────┬───────┘
     │                             │                               │
     │ 1. POST /auth/login         │                               │
     │ { email, password }         │                               │
     ├────────────────────────────>│                               │
     │                             │                               │
     │                             │ 2. Проверяет credentials      │
     │                             │    Генерирует JWT             │
     │                             │    (expires in 24h)           │
     │                             │                               │
     │ 3. { user, token }          │                               │
     │<────────────────────────────┤                               │
     │                             │                               │
     │ 4. Сохраняет token          │                               │
     │    в localStorage           │                               │
     │                             │                               │
     │ 5. GET /tasks               │                               │
     │    Authorization: Bearer <token>                            │
     ├─────────────────────────────────────────────────────────────>│
     │                             │                               │
     │                             │                6. Проверяет   │
     │                             │                   JWT локально│
     │                             │                   (без запроса│
     │                             │                   к auth)     │
     │                             │                               │
     │ 7. { tasks: [...] }         │                               │
     │<─────────────────────────────────────────────────────────────┤
     │                             │                               │
```

## Детали реализации

### 1. Генерация токена (Auth Service)

**Файл:** `be/auth/src/utils/jwt.ts`

```typescript
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,
    config.jwtSecret, // Секретный ключ
    { expiresIn: "24h" } // Токен живет 24 часа
  );
};
```

**Payload токена:**

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1699123456, // issued at
  "exp": 1699209856 // expires at (через 24 часа)
}
```

### 2. Проверка токена (Todos Service)

**Файл:** `be/todos/src/middlewares/auth.ts`

```typescript
export const authMiddleware = (req, res, next) => {
  // 1. Извлекает токен из заголовка Authorization
  const token = req.headers.authorization?.substring(7);

  // 2. Проверяет JWT локально (БЕЗ запроса к auth service)
  const payload = verifyToken(token);

  // 3. Если валидный - пропускает запрос
  req.user = payload;
  next();
};
```

**Важно:** Todos service НЕ общается с Auth service. Он проверяет токен самостоятельно используя тот же `JWT_SECRET`.

### 3. Хранение на клиенте

**Файл:** `fe/src/store/authStore.ts`

- Токен хранится в **httpOnly cookie** (недоступен для JavaScript)
- Cookie автоматически отправляется браузером с каждым запросом
- Защита от XSS атак (JavaScript не может прочитать токен)

## Это Access + Refresh токены?

**НЕТ.** Сейчас используется только **один токен** (access token).

### Разница:

| Параметр           | Текущая реализация      | Access + Refresh                |
| ------------------ | ----------------------- | ------------------------------- |
| Количество токенов | 1 (access)              | 2 (access + refresh)            |
| Срок жизни         | 24 часа                 | Access: 15 мин, Refresh: 7 дней |
| Обновление         | Нет (нужен новый login) | Автоматическое через refresh    |
| Безопасность       | Средняя                 | Высокая                         |
| Сложность          | Простая                 | Средняя                         |

### Как работает Access + Refresh (для сравнения):

```
Login → Получаешь 2 токена:
  - Access Token (15 минут) - для API запросов
  - Refresh Token (7 дней) - для обновления access token

Через 15 минут:
  - Access token истек
  - Клиент отправляет refresh token
  - Получает новый access token
  - Продолжает работу

Через 7 дней:
  - Refresh token истек
  - Нужен новый login
```

## Плюсы текущего подхода

✅ Простая реализация
✅ Нет дополнительных запросов для refresh
✅ Подходит для небольших проектов
✅ Микросервисы независимы (не нужно общаться с auth service)
✅ **HttpOnly cookies защищают от XSS атак**
✅ **Logout работает корректно (cookie удаляется)**

## Минусы текущего подхода

❌ Нельзя отозвать токен до истечения 24 часов (если cookie украдена)
❌ Уязвим к CSRF атакам (нужна дополнительная защита)
❌ Нет автоматического обновления (через 24 часа нужен новый login)

## Возможные улучшения

### 1. Добавить Refresh Token

- Access token: 15 минут
- Refresh token: 7 дней
- Автоматическое обновление

### 2. Добавить Redis Blacklist

- Хранить отозванные токены в Redis
- Проверять при каждом запросе
- Возможность logout с мгновенным эффектом

### 3. Добавить Token Introspection

- Todos service проверяет токен через Auth service
- Централизованный контроль
- Возможность отзыва в реальном времени

## Конфигурация

### Auth Service (.env)

```env
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

### Todos Service (.env)

```env
JWT_SECRET=your-secret-key-change-in-production  # Должен совпадать!
```

**Критически важно:** Оба сервиса должны использовать одинаковый `JWT_SECRET`, иначе Todos service не сможет проверить токены, созданные Auth service.

## Безопасность

### Что реализовано:

- ✅ JWT подпись (невозможно подделать токен)
- ✅ Expiration time (токен истекает через 24 часа)
- ✅ **HttpOnly cookies (защита от XSS)**
- ✅ **SameSite=lax (базовая защита от CSRF)**
- ✅ **Secure flag в production (только HTTPS)**
- ✅ **CORS настроен с credentials**
- ✅ Password hashing (bcrypt)
- ✅ **Logout endpoint (удаляет cookie)**

### Что НЕ реализовано:

- ❌ Token revocation (отзыв токенов до истечения)
- ❌ Refresh tokens
- ❌ Rate limiting
- ❌ CSRF tokens (дополнительная защита)
- ❌ Token rotation

## Для production рекомендуется:

1. Использовать HTTPS
2. Добавить refresh tokens
3. Добавить Redis для blacklist
4. Уменьшить срок жизни access token до 15 минут
5. Добавить rate limiting
6. Использовать сильный JWT_SECRET (минимум 32 символа)
7. Логировать все попытки авторизации
