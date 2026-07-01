import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'happyserv',
    user: process.env.DB_USER || 'happyserv',
    password: process.env.DB_PASSWORD || 'happyserv',
  },
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  wsPort: parseInt(process.env.WS_PORT || '3001', 10),
};
