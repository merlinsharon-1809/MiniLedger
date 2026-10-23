import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  otpTtl: Number(process.env.OTP_TTL) || 300,
  otpMaxAttempts: Number(process.env.OTP_MAX_ATTEMPTS) || 5,
};
