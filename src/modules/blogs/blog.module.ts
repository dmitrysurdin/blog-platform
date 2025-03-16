import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { BlogRepository } from './repositories/blog.repository';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { PostRepository } from '../posts/repositories/post.repository';
import { PostService } from '../posts/services/post.service';
import { CommentModule } from '../comments/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    CommentModule,
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository, PostService, PostRepository],
  exports: [BlogRepository],
})
export class BlogModule {}
