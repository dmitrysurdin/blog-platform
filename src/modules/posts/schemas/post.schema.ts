import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DATABASE } from '../../../constants';

@Schema({ collection: DATABASE.POSTS_COLLECTION })
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, ref: 'Blog' })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true, default: () => new Date().toISOString() })
  createdAt: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
