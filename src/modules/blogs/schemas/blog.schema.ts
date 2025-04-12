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

  @Prop({ default: false })
  isMembership: boolean;

  @Prop({ default: () => new Date().toISOString() })
  createdAt: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
