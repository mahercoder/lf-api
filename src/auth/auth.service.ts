import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';
import { OtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService
    ) {}

    async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
        const { email, password } = signInDto;

        const user = await this.usersService.findByEmail(email);

        if(!user){
            throw new NotFoundException('User not found');
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            throw new UnauthorizedException('Password is incorrect');
        }

        const payload = { id: user._id }
        const access_token = this.jwtService.sign(payload);

        return { access_token };
    }

    async signUp(signUpDto: SignUpDto): Promise<{ msg: string }> {
        const { email } = signUpDto;

        const existingUser = await this.usersService.findByEmail(email);

        if(existingUser) {
            throw new ConflictException('User already exist');
        }

        // Sending OTP code
        await this.emailService.sendOtp(email);

        return { msg: 'OTP code has been sent.' }
    }

    async signUpVerify(otpDto: OtpDto): Promise<{ access_token: string }> {
        const { email, password, otp_code } = otpDto;

        const isOtpValid = await this.emailService.verifyOtp(email, otp_code);
        if (!isOtpValid) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.create(email, hashedPassword);

        const payload = { id: user._id }
        const access_token = this.jwtService.sign(payload);

        return { access_token };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ msg: string }> {
        const { email } = resetPasswordDto;

        const existingUser = await this.usersService.findByEmail(email);

        if(!existingUser) {
            throw new NotFoundException('User not found');
        }

        // Sending OTP code
        await this.emailService.sendOtp(email);

        return { msg: 'OTP code has been sent.'}
    }

    async resetPasswordVerify(otpDto: OtpDto): Promise<{ msg: string }> {
        const { email, password, otp_code } = otpDto;

        const isOtpValid = await this.emailService.verifyOtp(email, otp_code);
        if (!isOtpValid) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersService.updateByEmail(email, {
            password: hashedPassword
        });

        return { msg: 'Password has been changed' }
    }

    async refreshAccessToken(user: any): Promise<{ access_token: string }> {
        const payload = { id: user._id }
        const access_token = this.jwtService.sign(payload);
        
        return { access_token }
    }
}
