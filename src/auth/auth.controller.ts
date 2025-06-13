import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';
import { OtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string }> {
        return this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }
    
    @HttpCode(HttpStatus.CREATED)
    @Post('signup/verify')
    async signupVerify(@Body() otpDto: OtpDto): Promise<{ access_token: string }> {
        return this.authService.signUpVerify(otpDto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ msg: string }> {
        return this.authService.resetPassword(resetPasswordDto);
    }


    @HttpCode(HttpStatus.OK)
    @Post('reset-password/verify')
    async resetPasswordVerify(@Body() otpDto: OtpDto): Promise<{ msg: string }>{
        return this.authService.resetPasswordVerify(otpDto);
    }

    @UseGuards(AuthGuard())
    @Get('me')
    async refreshAccessToken(@Request() req: any): Promise<{ access_token: string }>  {
        return this.authService.refreshAccessToken(req.user);
    }
}
