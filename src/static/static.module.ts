import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { BASE_PATH } from '../files/util/file.constants';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(BASE_PATH),
      serveRoot: '/files',
    }),
  ],
})
export class StaticModule {}
