import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class OtpDto {

    @IsNotEmpty()
    @IsEmail({}, { message: 'Email is incorrect!'})
    readonly email: string;
    
    @IsNotEmpty()
    @IsString()
    readonly password: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    readonly otp_code: string;
}