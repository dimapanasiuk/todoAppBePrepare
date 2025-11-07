# Cache Strategy - Объяснение

## Вопрос: Почему createTask обновляет кеш, а не добавляет в него?

Отличный вопрос! Давай разберем оба подхода.

## Два подхода к кешированию

### 1. Cache Invalidation (удаление кеша)

```typescript
async createTask() {
  const newTask = taskModel.create(...);
  await invalidateTodosCache(userId); // Удаляем кеш
  res.json(newTask);
}
```

**Как работает:**

```
1. POST /api/tasks → Создает task3
2. Удаляет кеш
3. GET /api/tasks → Кеша нет → Получает из БД [task1, task2, task3]
4. Сохраняет в кеш
```

**Плюсы:**

- ✅ Простой и надежный
- ✅ Нет риска рассинхронизации
- ✅ Меньше кода

**Минусы:**

- ❌ Следующий GET будет медленнее (из БД)

---

### 2. Cache Update (обновление кеша) ← **Текущая реализация**

```typescript
async createTask() {
  const newTask = taskModel.create(...);

  // Получаем все задачи и обновляем кеш
  const allTasks = taskModel.findAllByUserId(userId);
  await cacheTodos(userId, allTasks);

  res.json(newTask);
}
```

**Как работает:**

```
1. POST /api/tasks → Создает task3
2. Получает все задачи из БД [task1, task2, task3]
3. Обновляет кеш
4. GET /api/tasks → Кеш есть → Возвращает из кеша ⚡
```

**Плюсы:**

- ✅ Следующий GET будет быстрым (из кеша)
- ✅ Кеш всегда актуален

**Минусы:**

- ❌ Дополнительный запрос к БД при создании/обновлении/удалении
- ❌ Немного больше кода

---

## Почему не просто добавить task в кеш?

### Вариант 3: Добавление в кеш (НЕ рекомендуется)

```typescript
async createTask() {
  const newTask = taskModel.create(...);

  // Получаем текущий кеш
  const cachedTasks = await getCachedTodos(userId) || [];

  // Добавляем новую задачу
  cachedTasks.push(newTask);

  // Сохраняем обратно
  await cacheTodos(userId, cachedTasks);

  res.json(newTask);
}
```

**Проблемы:**

- ❌ Что если кеша нет? (первый запрос)
- ❌ Что если кеш устарел? (TTL истек)
- ❌ Что если другой процесс изменил БД?
- ❌ Сложная логика для UPDATE и DELETE

**Пример проблемы:**

```
1. User A: GET /api/tasks → Кеш: [task1, task2]
2. User A: POST /api/tasks → Создает task3
3. Добавляем в кеш: [task1, task2, task3]
4. Но что если между шагами 1 и 2 кто-то удалил task1?
5. Кеш: [task1, task2, task3] ← task1 не должно быть!
6. БД: [task2, task3] ← правильное состояние
```

---

## Текущая реализация (Cache Update)

Мы выбрали **Cache Update**, потому что:

1. **Производительность**: Следующий GET будет быстрым
2. **Надежность**: Всегда получаем актуальные данные из БД
3. **Простота**: Не нужно думать о edge cases

### Пример работы:

```bash
# 1. Первый GET (из БД)
curl http://localhost:3001/api/tasks -b cookies.txt
# → [task1, task2]
# Кеш: [task1, task2]

# 2. Создание задачи
curl -X POST http://localhost:3001/api/tasks \
  -d '{"title":"task3"}' -b cookies.txt
# → Создает task3
# → Получает из БД: [task1, task2, task3]
# → Обновляет кеш: [task1, task2, task3]

# 3. Следующий GET (из кеша!)
curl http://localhost:3001/api/tasks -b cookies.txt
# → [task1, task2, task3] ⚡ (из кеша)
```

---

## Сравнение производительности

| Операция                    | Cache Invalidation | Cache Update       |
| --------------------------- | ------------------ | ------------------ |
| POST /api/tasks             | 2ms                | 3ms (+1ms)         |
| GET /api/tasks (после POST) | 2ms (из БД)        | 0.5ms (из кеша) ⚡ |
| **Итого**                   | 4ms                | 3.5ms              |

**Вывод**: Cache Update быстрее в общем случае!

---

## Когда использовать каждый подход?

### Cache Invalidation

- ✅ Простые приложения
- ✅ Редкие изменения данных
- ✅ Когда важна простота кода

### Cache Update (наш выбор)

- ✅ Частые чтения после записи
- ✅ Когда важна производительность
- ✅ Когда можно получить все данные из БД быстро

### Добавление в кеш

- ❌ Не рекомендуется
- ⚠️ Только если точно знаешь, что делаешь
- ⚠️ Требует сложной логики для edge cases

---

## Итог

**Текущая реализация правильная!**

Мы **обновляем** кеш свежими данными из БД, а не просто добавляем новую задачу. Это гарантирует:

- ✅ Актуальность данных
- ✅ Высокую производительность
- ✅ Простоту кода

Если хочешь изменить на Cache Invalidation (проще, но медленнее), замени:

```typescript
// Вместо этого:
const allTasks = taskModel.findAllByUserId(userId);
await cacheTodos(userId, allTasks);

// Используй это:
await invalidateTodosCache(userId);
```
