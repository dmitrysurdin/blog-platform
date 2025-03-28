import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from '../../blogs/schemas/blog.schema';
import { Post } from '../../posts/schemas/post.schema';
import { Comment } from '../../comments/schemas/comment.schema';
import { User } from '../../users/schemas/user.schema';
import { RegistrationUser } from '../../auth/schemas/registration-user-schema';
import { RevokedToken } from '../../auth/schemas/revoked-token.schema';
import { PasswordRecovery } from '../../auth/schemas/password-recovery.schema';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RegistrationUser.name)
    private registrationUserModel: Model<RegistrationUser>,
    @InjectModel(RevokedToken.name)
    private revokedTokenModel: Model<RevokedToken>,
    @InjectModel(PasswordRecovery.name)
    private passwordRecoveryModel: Model<PasswordRecovery>,
  ) {}

  async clearDb(): Promise<void> {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.registrationUserModel.deleteMany({});
    await this.revokedTokenModel.deleteMany({});
    await this.passwordRecoveryModel.deleteMany({});
  }
}
