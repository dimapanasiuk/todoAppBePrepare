/**
 * Clear Script для Todos Service
 * 
 * Назначение:
 * - Удаляет все задачи из базы данных
 * - Используется для сброса данных в development окружении
 * 
 * Когда использовать:
 * - Перед повторным запуском seed скрипта
 * - Когда нужно очистить тестовые задачи
 * - При тестировании создания задач с нуля
 * - Для сброса БД к чистому состоянию
 * 
 * Запуск:
 * - npm run clear:todos (из корня be/)
 * - npm run clear (из директории todos/)
 * 
 * Что удаляется:
 * - Все задачи из коллекции tasks
 * - Задачи всех пользователей удаляются!
 * - Данные удаляются безвозвратно!
 * 
 * Типичный workflow:
 * 1. npm run clear:todos  - очистить задачи
 * 2. npm run seed:todos   - создать новые тестовые задачи
 * 
 * Примечание:
 * - Пользователи НЕ удаляются (они в другой базе auth_db)
 * - Для очистки пользователей используйте npm run clear:auth
 * 
 * Безопасность:
 * - ⚠️ НЕ использовать в production!
 * - Только для development окружения
 * - Нет подтверждения - данные удаляются сразу
 */

import { connectDB, disconnectDB } from '../utils/mongodb';
import { taskModel } from '../models/taskModel';

const clearData = async () => {
  try {
    console.log('🗑️  Starting database cleanup...');
    
    // Подключаемся к базе данных
    await connectDB();
    
    // Очищаем базу данных (удаляем все задачи)
    await taskModel.clear();
    
    console.log('✅ All tasks deleted');
    console.log('✅ Database cleanup completed!');
    console.log('\n💡 Tip: Run "npm run seed:todos" to create test tasks again');
    console.log('💡 Note: Users are NOT deleted (they are in auth_db)');
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MongoDB is running: docker ps');
    console.error('   2. Check MongoDB logs: docker logs todo-mongodb');
    await disconnectDB();
    process.exit(1);
  }
};

// Запуск скрипта
clearData();
