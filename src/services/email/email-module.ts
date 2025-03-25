import { EmailService } from './email-service';
import { EmailManager } from './email-manager';
import { EmailAdapter } from './email-adapter';
import { AuthRepository } from '../../modules/auth/repositories/auth.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../modules/users/schemas/user.schema';
import {
  RegistrationUser,
  RegistrationUserSchema,
} from '../../modules/auth/schemas/registration-user-schema';
import {
  RevokedToken,
  RevokedTokenSchema,
} from '../../modules/auth/schemas/revoked-token.schema';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../../modules/auth/schemas/password-recovery.schema';
import { UserRepository } from '../../modules/users/repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RegistrationUser.name, schema: RegistrationUserSchema },
      { name: RevokedToken.name, schema: RevokedTokenSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
    ]),
  ],
  providers: [
    EmailService,
    EmailManager,
    EmailAdapter,
    AuthRepository,
    UserRepository,
  ],
  exports: [EmailService, EmailManager],
})
export class EmailModule {}
