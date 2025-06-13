import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email is incorrect!'})
    readonly email: string;
}