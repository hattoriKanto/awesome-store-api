import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const mailOptions: Mail.Options = {
      from: `"Awesome Store" ${this.configService.get<string>('SMTP_USER')}`,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
