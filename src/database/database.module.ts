import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';

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
  ],
})
export class DatabaseModule {}
