import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { SeedingModule } from './seeding/seeding.module';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './exception-filters/not-found-exception/not-found-exception.filter';
import { DatabaseExceptionFilter } from './exception-filters/database-exception/database-exception.filter';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          username: 'postgres',
          password: config.get('DB_PASS'),
          host: 'localhost',
          port: 5432,
          database: 'postgres',
          autoLoadEntities: true,
        };
      },
      //   type: "postgres",
      //   username: "postgres",
      //   password: ConfigObject.
    }),
    SeedingModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },

    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
  ],
})
export class DatabaseModule {}
