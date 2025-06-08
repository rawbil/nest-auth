import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { comparePassword, hashPassword } from './utils/passwords';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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

    //hash refresh token --- failure to which you get an error stating token is too long for the column
    const hashedRefreshToken = await hashPassword(refresh_token);

    //save the refresh token to the database
    await this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });

    //return statement
    return {
      success: true,
      message: 'Login successful :)',
      access_token,
      refresh_token,
    };
  }

  //!generate new access_token from refresh_tokenn
  async refreshAccessToken(refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;

    if (!refresh_token) {
      throw new UnauthorizedException('Refresh Token not provided.');
    }

    //get jwt_secret from config
    const jwt_secret = this.config.get('JWT_SECRET');
    if (!jwt_secret) {
      throw new UnauthorizedException('oops...JWT secret not provided :(');
    }

    //decode payload from token
    const decoded = await this.jwtService.verifyAsync(
      refresh_token,
      jwt_secret,
    );
    if (!decoded) {
      throw new UnauthorizedException(
        'oops... authorization failed. Try again',
      );
    }

    //find decoded user
    const user = await this.prisma.users.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      throw new UnauthorizedException('Authorized user not found');
    }

    //verify refresh token against the one stored in DB
    const verifyRefreshToken = await comparePassword(
      refresh_token,
      user.refreshToken as string,
    );
    if (!verifyRefreshToken) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    //^__TO DO__
    //^If new refresh token is created, invalidate the old one
    await this.prisma.users.update({
      where: { id: user.id },
      data: { refreshToken: null },
    }); //!Not Working--fix later

    //generate a new access and refresh token
    return this.signTokens(user.id, user.email);
  }

  //!LOGOUT

  async logout(userId: string) {
    //delete refresh token from database
     await this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return {
      success: true,
      message: "Logged out successfully"
    }
  }
}
