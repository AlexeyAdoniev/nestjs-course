import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';
import { ThrottlerModuleOptions, seconds } from '@nestjs/throttler';

config();

export default registerAs('rateLimiter', () => {
  const config: ThrottlerModuleOptions = [
    {
      ttl: seconds(Number(process.env['RATE_LIMIT_TTL'])),
      limit: Number(process.env['RATE_LIMIT_REQUESTS']),
    },
  ];

  return config;
});
