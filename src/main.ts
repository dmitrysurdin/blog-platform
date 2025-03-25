import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({});
  app.use(cookieParser());
  app.useGlobalFilters();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

//TODO: Добавить дефолты для создания сущностей
