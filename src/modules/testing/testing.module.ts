import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingController } from './controllers/testing.controller';
import { TestingService } from './services/testing.service';
import { TestingRepository } from './repositories/testing.repository';
import { Blog, BlogSchema } from '../blogs/schemas/blog.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import {
  RegistrationUser,
  RegistrationUserSchema,
} from '../auth/schemas/registration-user-schema';
import {
  RevokedToken,
  RevokedTokenSchema,
} from '../auth/schemas/revoked-token.schema';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../auth/schemas/password-recovery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: RegistrationUser.name, schema: RegistrationUserSchema },
      { name: RevokedToken.name, schema: RevokedTokenSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
    ]),
  ],
  controllers: [TestingController],
  providers: [TestingService, TestingRepository],
})
export class TestingModule {}
