# TODO App - Frontend

React приложение с авторизацией и управлением задачами.

## 🚀 Технологии

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev server
- **Material-UI (MUI)** - UI компоненты
- **Zustand** - state management
- **Axios** - HTTP клиент

## 📦 Установка

```bash
npm install
```

## 🔧 Запуск

```bash
# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

Приложение откроется на **http://localhost:5173**

## 🏗 Структура проекта

```
src/
├── api/                    # API клиенты
│   ├── authApi.ts         # Auth Service API
│   └── taskApi.ts         # Todos Service API
│
├── components/            # React компоненты
│   ├── LoginForm.tsx      # Форма входа
│   ├── RegisterForm.tsx   # Форма регистрации
│   ├── TaskForm.tsx       # Форма создания/редактирования задачи
│   └── TaskList.tsx       # Список задач
│
├── store/                 # Zustand stores
│   ├── authStore.ts       # Состояние авторизации
│   └── taskStore.ts       # Состояние задач
│
├── types/                 # TypeScript типы
│   ├── Task.ts           # Типы для задач
│   └── User.ts           # Типы для пользователей
│
├── App.tsx               # Главный компонент
└── main.tsx              # Точка входа
```

## 🔐 Авторизация

### Workflow

1. **Неавторизованный пользователь**:
   - Видит форму входа/регистрации
   - Может зарегистрироваться или войти

2. **После входа/регистрации**:
   - JWT токен сохраняется в localStorage
   - Токен добавляется ко всем HTTP запросам
   - Пользователь видит список задач

3. **При выходе**:
   - Токен удаляется из localStorage
   - Axios headers очищаются
   - Редирект на форму входа

### Хранение состояния

Zustand с persist middleware автоматически сохраняет:
- Данные пользователя
- JWT токен

При перезагрузке страницы состояние восстанавливается.

## 🌐 API Endpoints

Frontend проксирует запросы к микросервисам через Vite:

### Auth Service (→ http://localhost:3000)

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь

### Todos Service (→ http://localhost:3001)

- `GET /api/tasks` - Список задач
- `POST /api/tasks` - Создать задачу
- `PUT /api/tasks/:id` - Обновить задачу
- `DELETE /api/tasks/:id` - Удалить задачу

## ⚙️ Конфигурация Vite

`vite.config.ts` настроен для проксирования запросов:

```typescript
proxy: {
  '/api/auth': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  '/api/tasks': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  }
}
```

**Важно**: Убедитесь, что оба бэкенд сервиса запущены!

## 🎨 UI/UX Features

- ✅ Адаптивный дизайн (mobile-first)
- ✅ Material Design
- ✅ Темная тема AppBar
- ✅ Floating Action Button на мобильных
- ✅ Модальные окна для форм
- ✅ Анимации и transitions
- ✅ Loading states
- ✅ Error handling с Alert компонентами

## 📱 Компоненты

### LoginForm

Форма входа с валидацией:
- Email (required, type email)
- Password (required)
- Переключение на регистрацию

### RegisterForm

Форма регистрации с валидацией:
- Username (required)
- Email (required, type email)
- Password (required, min 6 chars)
- Переключение на вход

### TaskForm

Универсальная форма для создания и редактирования:
- Title (required)
- Description (optional)
- Режимы: создание / редактирование

### TaskList

Список задач с возможностями:
- Отметка как выполненной
- Редактирование
- Удаление
- Пустое состояние

## 🔧 State Management

### authStore

```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null,
  
  login(dto): Promise<void>,
  register(dto): Promise<void>,
  logout(): void,
  checkAuth(): Promise<void>,
  clearError(): void
}
```

### taskStore

```typescript
{
  tasks: Task[],
  loading: boolean,
  error: string | null,
  
  fetchTasks(): Promise<void>,
  createTask(dto): Promise<void>,
  updateTask(id, dto): Promise<void>,
  deleteTask(id): Promise<void>,
  toggleTaskCompletion(id): Promise<void>
}
```

## 🐛 Отладка

### Проверка токена

```javascript
// В консоли браузера
localStorage.getItem('auth-storage')
```

### Проверка axios headers

```javascript
// В консоли браузера
console.log(axios.defaults.headers.common)
```

### Очистка состояния

```javascript
// В консоли браузера
localStorage.clear()
```

## 📝 Скрипты

```bash
# Development
npm run dev              # Запуск dev сервера

# Production
npm run build            # Сборка для production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Проверка с ESLint
npm run lint:fix         # Исправить ошибки ESLint
npm run format           # Форматирование с Prettier
npm run format:check     # Проверка форматирования
```

## 🚀 Production Build

```bash
# Сборка
npm run build

# Результат в папке dist/
ls dist/
```

Результат можно развернуть на:
- Vercel
- Netlify
- GitHub Pages
- Nginx
- Apache

## 📋 Переменные окружения

Создайте `.env` файл при необходимости:

```env
VITE_API_URL=http://your-api-domain.com
```

## 🔮 Будущие улучшения

- [ ] React Router для маршрутизации
- [ ] Фильтрация задач (все, активные, завершенные)
- [ ] Поиск по задачам
- [ ] Категории/теги для задач
- [ ] Дедлайны для задач
- [ ] Приоритеты задач
- [ ] Темная тема
- [ ] Internalization (i18n)
- [ ] PWA support
- [ ] Offline mode
- [ ] Unit тесты (Vitest)
- [ ] E2E тесты (Playwright)

## 📚 Документация

- [Material-UI](https://mui.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
