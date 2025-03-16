import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DATABASE } from '../../../constants';

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

  @Prop({ required: true, default: () => new Date().toISOString() })
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
