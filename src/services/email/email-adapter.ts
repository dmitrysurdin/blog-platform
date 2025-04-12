import { Injectable } from '@nestjs/common';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import { SendEmailInput } from './dto/send-email.input';

@Injectable()
export class EmailAdapter {
  sendEmail(input: SendEmailInput): Promise<SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    return transporter.sendMail({
      from: `Dmitrii Surdin <${process.env.EMAIL}>`,
      to: input.email,
      subject: input.subject,
      html: input.message,
    });
  }
}
