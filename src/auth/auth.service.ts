import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { comparePassword, hashPassword } from './utils/passwords';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  //!REGISTER
  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    //check if user with the provided email exists
    const emailExists = await this.prisma.users.findUnique({
      where: { email },
    });
    if (emailExists) {
      throw new ConflictException('IUser already exists. Try again...');
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    const newUser = await this.prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: 'User created successfully',
      newUser,
    };
  }

  //!LOGIN
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    //check if email exists
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('oops...invalid credentials!');
    }

    //compare passwords
    const comparePasswords = await comparePassword(password, user.password);
    if (!comparePasswords) {
      throw new UnauthorizedException('oops... invalid credentials!');
    }

    return this.signTokens(user.id, user.email);
  }

  //!Create access and refresh tokens
  async signTokens(userId: string, email: string) {
    const payload = { userId, email };
    // await this.jwtService.sign(payload, this.config.get('JWT_SECRET'));

    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new UnauthorizedException('jwt secret not found');
    }

    //sign access token
    const access_token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '1h',
    });

    //sign refresh token
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '7d',
    });

    //hash refresh token
    const hashedRefreshToken = await hashPassword(refresh_token);

    //save the refresh token to the database
    await this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken},
    });

    //return statement
    return {
        success: true,
        message: "Login successful :)",
        access_token,
        refresh_token,
    }
  }

  //!Logout
  async logout() {
    
  }
}
