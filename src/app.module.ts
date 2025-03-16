import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './database/database.config';
import { BlogModule } from './modules/blogs/blog.module';
import { CommentModule } from './modules/comments/comment.module';
import { PostModule } from './modules/posts/post.module';
import { UserModule } from './modules/users/user.module';
import { TestingModule } from './modules/testing/testing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }), // Загружаем переменные окружения
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.MONGO_URI'),
        dbName: configService.get<string>('database.name'),
      }),
    }),
    BlogModule,
    CommentModule,
    PostModule,
    UserModule,
    TestingModule,
  ],
})
export class AppModule {}
