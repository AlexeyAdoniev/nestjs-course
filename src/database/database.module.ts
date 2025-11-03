import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { SeedingModule } from './seeding/seeding.module';

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
})
export class DatabaseModule {}
