import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostRepository } from './repositories/post.repository';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { BlogModule } from '../blogs/blog.module';
import { CommentModule } from '../comments/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    BlogModule,
    CommentModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
