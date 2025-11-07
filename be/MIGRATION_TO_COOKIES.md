# Миграция на HttpOnly Cookies

## Что изменилось

### До (localStorage):

```
Client → Login → Получает token в JSON
       → Сохраняет в localStorage
       → Отправляет в заголовке Authorization: Bearer <token>
```

### После (httpOnly cookies):

```
Client → Login → Получает token в httpOnly cookie
       → Браузер автоматически сохраняет cookie
       → Браузер автоматически отправляет cookie с каждым запросом
```

## Преимущества

### Безопасность:

- ✅ **Защита от XSS**: JavaScript не может прочитать токен
- ✅ **Автоматическое управление**: браузер сам отправляет cookies
- ✅ **Logout работает**: cookie удаляется на сервере
- ✅ **SameSite защита**: базовая защита от CSRF

### Недостатки localStorage:

- ❌ Уязвим к XSS атакам (любой JS может прочитать токен)
- ❌ Logout не работает (токен остается валидным)
- ❌ Нужно вручную добавлять токен к запросам

## Изменения в коде

### Backend (Auth Service)

**1. Установлены зависимости:**

```bash
npm install cookie-parser @types/cookie-parser
```

**2. Добавлен cookie-parser middleware:**

```typescript
// be/auth/src/index.ts
import cookieParser from "cookie-parser";

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Важно!
  })
);
```

**3. Login/Register отправляют cookie:**

```typescript
// be/auth/src/controllers/authController.ts
res.cookie("token", token, {
  httpOnly: true, // Недоступен для JS
  secure: config.env === "production", // HTTPS only в production
  sameSite: "lax", // CSRF защита
  maxAge: 24 * 60 * 60 * 1000, // 24 часа
});

res.json({ user }); // Токен НЕ отправляется в body
```

**4. Добавлен logout endpoint:**

```typescript
// POST /api/auth/logout
logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully' });
}
```

**5. Middleware читает cookie:**

```typescript
// be/auth/src/middlewares/auth.ts
const token = req.cookies?.token; // Вместо req.headers.authorization
```

### Backend (Todos Service)

**Те же изменения:**

1. Установлен cookie-parser
2. CORS с credentials: true
3. Middleware читает token из cookies

### Frontend

**1. Axios настроен на отправку cookies:**

```typescript
// fe/src/api/axiosConfig.ts
axios.defaults.withCredentials = true;
```

**2. Store упрощен (не хранит токен):**

```typescript
// fe/src/store/authStore.ts
interface AuthState {
  user: User | null;
  // token: string | null; ← УДАЛЕНО
  isAuthenticated: boolean;
  // ...
}
```

**3. AuthResponse без токена:**

```typescript
// fe/src/types/User.ts
export interface AuthResponse {
  user: User;
  // token: string; ← УДАЛЕНО
}
```

**4. Добавлен logout метод:**

```typescript
// fe/src/api/authApi.ts
async logout(): Promise<void> {
  await axios.post(`${API_BASE_URL}/logout`);
}
```

## Тестирование

### 1. Проверка cookie в DevTools:

```
1. Открыть DevTools → Application → Cookies
2. После login должна появиться cookie 'token'
3. Флаги: HttpOnly ✓, SameSite: Lax, Secure (в production)
```

### 2. Проверка запросов:

```
1. DevTools → Network
2. Любой запрос к API
3. Request Headers должен содержать: Cookie: token=...
4. НЕ должно быть: Authorization: Bearer ...
```

### 3. Проверка logout:

```
1. Logout
2. Cookie 'token' должна исчезнуть из DevTools
3. Последующие запросы должны возвращать 401
```

## Важные моменты

### CORS конфигурация:

```typescript
app.use(
  cors({
    origin: "http://localhost:5173", // Точный URL фронтенда
    credentials: true, // ОБЯЗАТЕЛЬНО для cookies
  })
);
```

### Axios конфигурация:

```typescript
axios.defaults.withCredentials = true; // ОБЯЗАТЕЛЬНО
```

### Cookie параметры:

- `httpOnly: true` - защита от XSS
- `secure: true` - только HTTPS (в production)
- `sameSite: 'lax'` - защита от CSRF
- `maxAge` - время жизни cookie

## Production checklist

- [ ] Установить `secure: true` (требует HTTPS)
- [ ] Настроить правильный `origin` в CORS
- [ ] Использовать сильный JWT_SECRET
- [ ] Добавить CSRF защиту (если нужна дополнительная)
- [ ] Настроить rate limiting
- [ ] Логировать попытки авторизации

## Откат (если нужно вернуться к localStorage)

1. Убрать `withCredentials` из axios
2. Вернуть `Authorization: Bearer` заголовок
3. Вернуть токен в response body
4. Убрать cookie-parser
5. Вернуть persist для токена в store
