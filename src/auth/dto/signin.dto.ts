import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email is incorrect!'})
    readonly email: string;
    
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}