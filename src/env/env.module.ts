import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ENV_VALIDATION_SCHEEMA } from './env.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      validationSchema: ENV_VALIDATION_SCHEEMA,
    }),
  ],
})
export class EnvModule {}
