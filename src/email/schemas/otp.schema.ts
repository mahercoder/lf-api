import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum OtpType {
    Registration = 1,
    PasswordReset = 2
}

@Schema()
export class OTP extends Document {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true, enum: OtpType })
    type: OtpType;

    @Prop({ required: true })
    expiry: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);