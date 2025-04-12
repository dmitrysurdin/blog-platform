import { Injectable } from '@nestjs/common';
import { EmailAdapter } from './email-adapter';
import {
  SendConfirmationEmailInput,
  SendRecoveryPasswordInput,
} from './dto/email-manager.input';

@Injectable()
export class EmailManager {
  constructor(private readonly emailAdapter: EmailAdapter) {}

  async sendConfirmationEmail(input: SendConfirmationEmailInput) {
    const message = `
      <h1>Thank you for your registration</h1>
      <p>
        To finish registration, follow the link below:
        <a href="https://somesite.com/confirm-email?code=${input.confirmationCode}">
          Complete registration
        </a>
      </p>
    `;

    return await this.emailAdapter.sendEmail({
      email: input.email,
      subject: 'Confirm account',
      message,
    });
  }

  async sendPasswordRecovery(input: SendRecoveryPasswordInput) {
    const message = `
      <h1>Password recovery</h1>
      <p>
        To recover your password, follow the link below:
        <a href="https://somesite.com/password-recovery?recoveryCode=${input.recoveryCode}">
          Recover password
        </a>
      </p>
    `;

    return await this.emailAdapter.sendEmail({
      email: input.email,
      subject: 'Password recovery',
      message,
    });
  }
}
