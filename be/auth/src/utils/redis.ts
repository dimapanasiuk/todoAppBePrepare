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

// Blacklist token (при logout)
export const blacklistToken = async (token: string, expiresIn: number = 86400): Promise<void> => {
  try {
    await redisClient.setEx(`blacklist:${token}`, expiresIn, 'true');
  } catch (error) {
    console.error('Error blacklisting token:', error);
  }
};

// Проверка токена в blacklist
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
