import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register') //POST /auth/register
    register(@Body(ValidationPipe) registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login') //POST /auth/login
    login(@Body(ValidationPipe) loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('refresh-token') //POST /auth/refresh-token
    refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {{
        return this.authService.refreshAccessToken(refreshTokenDto);
    }}
}
