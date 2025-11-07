import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err: Error) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Redis connected'));

// Connect to Redis
export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
};

// Кеширование todos для пользователя
export const cacheTodos = async (userId: string, todos: any[]): Promise<void> => {
  try {
    await redisClient.setEx(`todos:${userId}`, 300, JSON.stringify(todos)); // 5 минут
  } catch (error) {
    console.error('Error caching todos:', error);
  }
};

// Получение todos из кеша
export const getCachedTodos = async (userId: string): Promise<any[] | null> => {
  console.log('getCachedTodos', {userId})
  try {
    const cached = await redisClient.get(`todos:${userId}`);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error getting cached todos:', error);
    return null;
  }
};

// Инвалидация кеша при изменении todos
export const invalidateTodosCache = async (userId: string): Promise<void> => {
  try {
    await redisClient.del(`todos:${userId}`);
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
};

// Проверка токена в blacklist (для синхронизации с auth сервисом)
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const result = await redisClient.get(`blacklist:${token}`);
    return result !== null;
  } catch (error) {
    console.error('Error checking blacklist:', error);
    return false;
  }
};

export default redisClient;
