import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import { envs } from 'src/config/envs';

@Injectable()
export class EmailService {
    private readonly transporter: nodemailer.Transporter;
    private emails: string[] = ['darianahernandez0406@gmail.com'];
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: envs.MAILER_SERVICE,
            auth: {
                user: envs.MAILER_USER,
                pass: envs.MAILER_TOKEN,
            },
        });
    }

    async sendEmail(template:string){
        await this.transporter.sendMail({
            to: 'darianahernandez0406@gmail.com',
            subject: 'Mascota perdida',
            html:template,
        });
    }
}
