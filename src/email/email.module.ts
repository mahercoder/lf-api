import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { OTP, OTPSchema } from './schemas/otp.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])
    ],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {}
