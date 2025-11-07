/**
 * Clear Script для Auth Service
 * 
 * Назначение:
 * - Удаляет всех пользователей из базы данных
 * - Используется для сброса данных в development окружении
 * 
 * Когда использовать:
 * - Перед повторным запуском seed скрипта
 * - Когда нужно очистить тестовые данные
 * - При переключении между разными наборами тестовых данных
 * - Для сброса БД к чистому состоянию
 * 
 * Запуск:
 * - npm run clear:auth (из корня be/)
 * - npm run clear (из директории auth/)
 * 
 * Что удаляется:
 * - Все пользователи из коллекции users
 * - Данные удаляются безвозвратно!
 * 
 * Типичный workflow:
 * 1. npm run clear:auth  - очистить данные
 * 2. npm run seed:auth   - создать новые тестовые данные
 * 
 * Безопасность:
 * - ⚠️ НЕ использовать в production!
 * - Только для development окружения
 * - Нет подтверждения - данные удаляются сразу
 */

import { connectDB, disconnectDB } from '../utils/mongodb';
import { userModel } from '../models/userModel';

const clearData = async () => {
  try {
    console.log('🗑️  Starting database cleanup...');
    
    // Подключаемся к базе данных
    await connectDB();
    
    // Получаем количество пользователей перед удалением
    const users = await userModel.findAll();
    const count = users.length;
    
    if (count === 0) {
      console.log('ℹ️  Database is already empty');
      await disconnectDB();
      return;
    }
    
    // Предупреждение о количестве удаляемых записей
    console.log(`⚠️  This will delete ${count} user(s) from the database`);
    
    // Очищаем базу данных
    await userModel.clear();
    
    console.log(`✅ Deleted ${count} user(s)`);
    console.log('✅ Database cleanup completed!');
    console.log('\n💡 Tip: Run "npm run seed:auth" to create test users again');
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    await disconnectDB();
    process.exit(1);
  }
};

// Запуск скрипта
clearData();
