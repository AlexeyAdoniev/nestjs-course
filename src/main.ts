import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors(helmet());

  const config = new DocumentBuilder()
    .setTitle('Test')
    .setDescription('Documentation for the shop API')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
