import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DATABASE } from '../../../constants';

@Schema({ collection: DATABASE.BLOG_COLLECTION })
export class Blog extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true, default: false })
  isMembership: boolean;

  @Prop({ required: true, default: () => new Date().toISOString() })
  createdAt: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
