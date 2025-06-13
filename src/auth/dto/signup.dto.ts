import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email is incorrect!'})
    readonly email: string;
}