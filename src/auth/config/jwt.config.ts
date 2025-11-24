import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { config } from 'dotenv';

config();

export default registerAs('jwt', () => {
  const config = {
    secret: process.env.JTW_SECRET,
    signOptions: {
      expiresIn: (process.env.JTW_TTL as any) || '7d',
    },
  } as const satisfies JwtModuleOptions;

  return config;
});
