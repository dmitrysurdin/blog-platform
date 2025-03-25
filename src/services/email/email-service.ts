import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EmailManager } from './email-manager';
import { AuthRepository } from '../../modules/auth/repositories/auth.repository';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailManager: EmailManager,
    private readonly authRepository: AuthRepository,
  ) {}

  async resendConfirmationEmail(email: string) {
    const user = await this.authRepository.findRegistrationUserByEmail(email);

    if (!user || user.isConfirmed) {
      throw {
        errorsMessages: [
          { field: 'email', message: 'User is confirmed or not exists' },
        ],
      };
    }

    const newCode = uuidv4();
    await this.authRepository.updateConfirmationCodeById(
      user._id.toString(),
      newCode,
    );

    return this.emailManager.sendConfirmationEmail({
      email,
      confirmationCode: newCode,
    });
  }

  async sendPasswordRecovery(email: string) {
    const user = await this.authRepository.findUserByLoginOrEmail(email);
    if (!user) {
      throw {
        errorsMessages: [{ field: 'email', message: 'User not found' }],
      };
    }

    const recoveryCode = uuidv4();
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.authRepository.createPasswordRecoveryRecord(
      user._id.toString(),
      recoveryCode,
      expirationDate,
    );

    return this.emailManager.sendPasswordRecovery({
      email,
      recoveryCode,
    });
  }
}
