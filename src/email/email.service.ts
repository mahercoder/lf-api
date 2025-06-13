import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as nodemailer from 'nodemailer';
import { OTP, OtpType } from './schemas/otp.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(
        @InjectModel(OTP.name) private otpModel: Model<OTP>,
        private configService: ConfigService
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASSWORD')
            }
        })
    }

    private generateOtp(): string {
        return Math.floor(1000 + Math.random() * 9000).toString(); // 4 xonali OTP
    }

    async sendMail(email: string, otp: string, subject: string, text: string): Promise<void>{
        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: email,
            subject, 
            text
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendOtp(email: string): Promise<void> {
        const otp = this.generateOtp();
        const expiry = new Date(Date.now() + Number(this.configService.get<number>('OTP_EXPIRY'))); // 5 daqiqa

        const subject = 'Life Control';
        const text = `Sizning verifikatsiya kodingiz: ${otp}. Amal qilish muddati 5 daqiqa.`;

        // Oldingi OTP'ni o'chirish
        await this.otpModel.deleteMany({ email });

        // Yangi OTP yaratish
        await this.otpModel.create({ 
            email, 
            code: otp,
            type: OtpType.Registration, 
            expiry 
        });

        // FIXME: Test uchun OTP konsolga:
        console.log(subject, text);
        
        // OTP'ni foydalanuvchiga yuborish
        // FIXME: Haqiqiy email yuborish uchun kommentdan chiqar
        // await this.sendMail(email, otp, subject, text);
    }

    async verifyOtp(email: string, code: string): Promise<boolean> {
        const otp = await this.otpModel.findOne({ email });

        if (!otp || otp.expiry < new Date() || otp.code !== code) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        // Tasdiqlanganidan keyin OTP'ni o'chirib tashlash
        await this.otpModel.deleteMany({ email });

        return true;
    }
}
