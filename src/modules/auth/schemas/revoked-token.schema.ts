import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DATABASE } from '../../../constants';

@Schema({ collection: DATABASE.REVOKED_TOKENS_COLLECTION })
export class RevokedToken extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;
}

export const RevokedTokenSchema = SchemaFactory.createForClass(RevokedToken);
