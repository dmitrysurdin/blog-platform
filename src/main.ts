import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({});
  app.use(cookieParser());
  app.useGlobalFilters();
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.flatMap((err) =>
          (err.constraints ? Object.values(err.constraints) : []).map(
            (message) => ({
              message,
              field: err.property,
            }),
          ),
        );

        return new BadRequestException({ errorsMessages: formattedErrors });
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

//TODO: Добавить дефолты для создания сущностей
