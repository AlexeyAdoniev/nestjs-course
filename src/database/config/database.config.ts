import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

export default registerAs('database', () => ({
  password: process.env.DB_PASS,
}));
