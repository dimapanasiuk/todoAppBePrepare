# Запуск с HttpOnly Cookies

## Быстрый старт

### 1. Установить зависимости (если еще не установлены):

```bash
# В корне be/
npm run install:all

# Или отдельно:
cd auth && npm install
cd ../todos && npm install
```

### 2. Проверить .env файлы:

**be/auth/.env:**

```env
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

**be/todos/.env:**

```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
AUTH_SERVICE_URL=http://localhost:3000
```

⚠️ **Важно:** `JWT_SECRET` должен быть одинаковым в обоих сервисах!

### 3. Запустить сервисы:

```bash
# Из корня be/
npm run dev

# Или отдельно:
npm run dev:auth   # Auth на :3000
npm run dev:todos  # Todos на :3001
```

### 4. Запустить фронтенд:

```bash
cd fe
npm run dev  # Frontend на :5173
```

## Проверка работы

### 1. Тест через браузер:

1. Открыть http://localhost:5173
2. Зарегистрироваться или войти
3. Открыть DevTools → Application → Cookies
4. Должна появиться cookie `token` с флагом HttpOnly

### 2. Тест через curl:

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt \
  -v
```

Должен вернуть:

```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "username": "Test User"
  }
}
```

И установить cookie в `cookies.txt`.

**Получить задачи (с cookie):**

```bash
curl http://localhost:3001/api/tasks \
  -b cookies.txt \
  -v
```

**Logout:**

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt \
  -v
```

### 3. Проверка безопасности:

**Попытка доступа без cookie:**

```bash
curl http://localhost:3001/api/tasks
```

Должен вернуть:

```json
{ "error": "No token provided" }
```

## Endpoints

### Auth Service (http://localhost:3000)

| Method | Endpoint           | Auth | Description                 |
| ------ | ------------------ | ---- | --------------------------- |
| POST   | /api/auth/register | No   | Регистрация                 |
| POST   | /api/auth/login    | No   | Вход (устанавливает cookie) |
| POST   | /api/auth/logout   | No   | Выход (удаляет cookie)      |
| GET    | /api/auth/me       | Yes  | Текущий пользователь        |
| GET    | /health            | No   | Health check                |

### Todos Service (http://localhost:3001)

| Method | Endpoint       | Auth | Description     |
| ------ | -------------- | ---- | --------------- |
| GET    | /api/tasks     | Yes  | Все задачи      |
| GET    | /api/tasks/:id | Yes  | Одна задача     |
| POST   | /api/tasks     | Yes  | Создать задачу  |
| PUT    | /api/tasks/:id | Yes  | Обновить задачу |
| DELETE | /api/tasks/:id | Yes  | Удалить задачу  |
| GET    | /health        | No   | Health check    |

## Troubleshooting

### Cookie не устанавливается:

1. Проверить CORS настройки:

   ```typescript
   app.use(
     cors({
       origin: "http://localhost:5173", // Точный URL
       credentials: true, // Обязательно!
     })
   );
   ```

2. Проверить axios настройки:
   ```typescript
   axios.defaults.withCredentials = true;
   ```

### 401 Unauthorized на todos service:

1. Проверить что `JWT_SECRET` одинаковый в обоих сервисах
2. Проверить что cookie отправляется (DevTools → Network → Request Headers)
3. Проверить что cookie-parser установлен и подключен

### Cookie не удаляется при logout:

1. Проверить параметры `clearCookie` (должны совпадать с `cookie`)
2. Проверить что logout endpoint вызывается
3. Очистить cookies вручную в DevTools

### CORS ошибки:

1. Убедиться что frontend на http://localhost:5173
2. Проверить что `credentials: true` в CORS
3. Проверить что `withCredentials: true` в axios

## Отличия от localStorage подхода

| Аспект     | localStorage            | httpOnly Cookie         |
| ---------- | ----------------------- | ----------------------- |
| Хранение   | JavaScript может читать | Только браузер          |
| Отправка   | Вручную в заголовке     | Автоматически           |
| XSS защита | ❌ Уязвим               | ✅ Защищен              |
| Logout     | Токен остается валидным | Cookie удаляется        |
| CORS       | Простая настройка       | Нужен credentials: true |

## Production настройки

В production нужно изменить:

**Backend (.env):**

```env
NODE_ENV=production
JWT_SECRET=<сильный-случайный-ключ-минимум-32-символа>
```

**Backend (код):**

```typescript
app.use(
  cors({
    origin: "https://yourdomain.com", // Ваш домен
    credentials: true,
  })
);
```

Cookie автоматически получит `secure: true` в production (только HTTPS).

**Frontend:**

```typescript
// Убедиться что API_BASE_URL указывает на production
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
```
