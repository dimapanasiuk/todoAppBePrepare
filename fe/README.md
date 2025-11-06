# Todo Frontend

Простой фронтенд для Todo приложения, построенный с использованием React, TypeScript, Material-UI и Zustand.

## Технологии

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Material-UI (MUI)** - компоненты UI
- **Zustand** - state management
- **Axios** - HTTP клиент
- **Vite** - сборщик и dev сервер

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

**Важно:** Убедитесь, что backend сервер запущен на `http://localhost:3000`

## Сборка

```bash
npm run build
```

## Структура проекта

```
fe/
├── src/
│   ├── api/          # API клиент
│   ├── components/   # React компоненты
│   ├── store/        # Zustand store
│   ├── types/        # TypeScript типы
│   ├── App.tsx       # Главный компонент
│   └── main.tsx      # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Возможности

- ✅ Просмотр списка задач
- ✅ Создание новой задачи
- ✅ Редактирование задачи
- ✅ Удаление задачи
- ✅ Отметка задачи как выполненной
- ✅ Адаптивный дизайн (mobile-first)

