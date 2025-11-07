export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  bcryptSaltRounds: 10,
};



