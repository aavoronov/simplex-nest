import { HttpException, Injectable } from '@nestjs/common';
import {
  IEmailOneClickCreds,
  IEmailRegister,
  IPasswordRestore,
} from './interfaces/email.body';

import { createTransport } from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// const user = process.env.MAILER_USER;
// const pass = process.env.MAILER_PASSWORD;

@Injectable()
export class MailerService {
  user = process.env.MAILER_USER;
  postfix = process.env.MAILER_USER_POSTFIX;
  pass = process.env.MAILER_PASSWORD;
  host = process.env.MAILER_HOST;
  port = process.env.MAILER_PORT;
  sender = process.env.MAILER_SENDER;
  apiUrl = process.env.API_URL;

  // transporter = createTransport({
  //   host: 'smtp.yandex.ru',
  //   port: 465,
  //   //   service: "mail",
  //   secure: true,
  //   auth: {
  //     user: this.user + '@yandex.ru',
  //     pass: this.pass,
  //   },
  // });

  transporter = createTransport({
    host: this.host,
    port: this.port,
    secure: true,
    auth: {
      user: this.user + this.postfix,
      pass: this.pass,
    },
  });

  async sendMailRegister(body: IEmailRegister) {
    try {
      const output = `
            <p>Аккаунт зарегистрирован. <a href="${this.apiUrl}users/verify?key=${body.verification}">Нажмите, чтобы подтвердить ваш аккаунт.</a></p>
        `;
      const mailOptions = {
        from: `${this.sender} <${this.user}${this.postfix}>`,
        to: body.email,
        subject: `Данные нового аккаунта ${this.sender}`,
        html: output,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async restorePasswordMail(body: IPasswordRestore) {
    try {
      const output = `
            <p>С вашей учетной записи запрошена смена пароля. <a href="${this.apiUrl}users/restore?key=${body.token}">Нажмите, чтобы установить новый пароль.</a></p>
            <p>Если вы не запрашивали смену пароля, просто игнорируйте это письмо.</p>
        `;
      const mailOptions = {
        from: `${this.sender} <${this.user}${this.postfix}>`,
        to: body.email,
        subject: 'Восстановление пароля к аккаунту',
        html: output,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async sendOneClickCredentials(body: IEmailOneClickCreds) {
    const output = `
    <p>Аккаунт зарегистрирован. Данные вашего аккаунта:</p>
    <p>логин: ${body.login}</p>
    <p>пароль: ${body.password}</p>
`;
    const mailOptions = {
      from: `${this.sender} <${this.user}${this.postfix}>`,
      to: body.email,
      subject: `Данные нового аккаунта ${this.sender}`,
      html: output,
    };

    await this.transporter.sendMail(mailOptions);
  }
  catch(e) {
    throw new HttpException(e.message, e.status, {
      cause: new Error('Some Error'),
    });
  }
}
