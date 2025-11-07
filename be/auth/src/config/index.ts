export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  bcryptSaltRounds: 10,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017',
  mongodbDbName: process.env.MONGODB_DB_NAME || 'auth_db',
};



