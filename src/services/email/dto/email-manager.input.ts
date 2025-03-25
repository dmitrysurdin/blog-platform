export class SendConfirmationEmailInput {
  email: string;
  confirmationCode: string;
}

export class SendRecoveryPasswordInput {
  email: string;
  recoveryCode: string;
}
