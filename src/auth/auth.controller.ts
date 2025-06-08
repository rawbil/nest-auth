import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';
import { GetUser } from './decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token') //POST /auth/refresh-token
  refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    {
      return this.authService.refreshAccessToken(refreshTokenDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout') //POST /auth/logout
  logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password') //POST /auth/change-password
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @GetUser('id') id: string) {
    return this.authService.changePassword(id, changePasswordDto);
  }

  @Post('reset-password') //POST /auth/reset-password
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @GetUser('id') id: string) {
    return this.authService.resetPassword(id, resetPasswordDto);
  }
}
