import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  username: 'postgres',
  password: process.env.DB_PASS,
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  entities: ['dist/domain/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
});
