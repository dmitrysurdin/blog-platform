import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DATABASE, LikeStatus } from '../../../constants';

@Schema({ collection: DATABASE.COMMENTS_COLLECTION })
export class Comment extends Document {
  @Prop({ required: true, ref: 'Post' })
  postId: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    required: true,
    type: {
      userId: { type: String, required: true, ref: 'User' },
      userLogin: { type: String, required: true },
    },
  })
  commentatorInfo: { userId: string; userLogin: string };

  @Prop({ required: true })
  createdAt: string;

  @Prop({
    type: Object,
    default: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.None,
    },
  })
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
