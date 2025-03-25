import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  RevokedToken,
  RevokedTokenSchema,
} from './schemas/revoked-token.schema';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from './schemas/password-recovery.schema';
import {
  RegistrationUser,
  RegistrationUserSchema,
} from './schemas/registration-user-schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UserRepository } from '../users/repositories/user.repository';
import { JwtAccessStrategy } from '../../auth/strategies/jwt-access.strategy';
import { JwtSoftStrategy } from '../../auth/strategies/jwt-soft.strategy';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { EmailService } from '../../services/email/email-service';
import { EmailAdapter } from '../../services/email/email-adapter';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../../services/email/email-module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RegistrationUser.name, schema: RegistrationUserSchema },
      { name: RevokedToken.name, schema: RevokedTokenSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    UserRepository,

    JwtAccessStrategy,
    JwtSoftStrategy,

    EmailService,
    EmailAdapter,
  ],
  exports: [AuthRepository],
})
export class AuthModule {}
