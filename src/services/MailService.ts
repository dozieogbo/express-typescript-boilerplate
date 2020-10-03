import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import sendgrid from '@sendgrid/mail';
import mailgun from 'mailgun.js';
import { Service } from 'typedi';
import config from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { User } from '../models/entities/User';

@Service()
export class MailService {
  constructor(@Logger(__filename) private log: LoggerInterface) {}

  private async readTemplate(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, `../templates/mail/${name}.html`),
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(String(data));
          }
        },
      );
    });
  }

  private replaceSubstitutions(mailTemplate: string, substitutions: object = {}) {
    Object.entries(substitutions).forEach(([key, value]) => {
      mailTemplate = mailTemplate.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return mailTemplate;
  }

  public async sendThroughSandbox(
    user: Partial<User>,
    subject: string,
    mailContent: string,
  ): Promise<boolean> {
    try {
      let transporter = nodemailer.createTransport({
        host: config.mail.sandbox.host,
        port: config.mail.sandbox.port,
        secure: false,
        auth: {
          user: config.mail.sandbox.username,
          pass: config.mail.sandbox.password,
        },
      });

      let info = await transporter.sendMail({
        from: `"${config.mail.fromName}" <${config.mail.fromEmail}>`,
        to: user.email,
        subject,
        html: mailContent,
      });

      this.log.info(`Sandbox email sent: ${info.messageId}`);

      return true;
    } catch (error) {
      this.log.error(error);

      return false;
    }
  }

  public async sendThroughMailgun(
    user: Partial<User>,
    subject: string,
    mailContent: string,
  ): Promise<boolean> {
    const client = mailgun.client({
      username: 'api',
      key: config.mail.mailgun.apiKey,
    });

    try {
      const result = await client.messages.create(config.mail.mailgun.domain, {
        from: `${config.mail.fromName} <${config.mail.fromEmail}>`,
        to: [user.email],
        subject,
        html: mailContent,
      });

      this.log.info(`Sengrid email sent to ${user.email}: ${result.id}`);

      return true;
    } catch (error) {
      this.log.error(error.response?.body || error);

      return false;
    }
  }

  public async sendThroughSendgrid(
    user: Partial<User>,
    subject: string,
    mailContent: string,
  ): Promise<boolean> {
    sendgrid.setApiKey(config.mail.sendgrid.apiKey);

    const msg = {
      to: {
        name: user.getFullName(),
        email: user.email,
      },
      from: {
        name: config.mail.fromName,
        email: config.mail.fromEmail,
      },
      subject,
      html: mailContent,
    };

    try {
      await sendgrid.send(msg);

      this.log.info(`Sengrid email sent to ${user.email}`);

      return true;
    } catch (error) {
      this.log.error(error.response?.body || error);

      return false;
    }
  }

  public async send(
    user: Partial<User>,
    subject: string,
    mailContent: string,
  ): Promise<boolean> {
    if (config.mail.sandboxMode) {
      return await this.sendThroughSandbox(user, subject, mailContent);
    } else {
      return await this.sendThroughMailgun(user, subject, mailContent);
    }
  }

  public async renderAndSend(
    user: Partial<User>,
    subject: string,
    templateName: string,
    substitutions: object = {},
  ) {
    const mailTemplate = await this.readTemplate(templateName);

    const mailContent = this.replaceSubstitutions(mailTemplate, substitutions);

    return await this.send(user, subject, mailContent);
  }
}
