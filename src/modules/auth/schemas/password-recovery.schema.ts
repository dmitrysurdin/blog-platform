import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DATABASE } from '../../../constants';

@Schema({ collection: DATABASE.PASSWORD_RECOVERY_COLLECTION })
export class PasswordRecovery extends Document {
  @Prop()
  userId: string;

  @Prop({ required: true })
  recoveryCode: string;

  @Prop({ required: true })
  expirationDate: Date;
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
