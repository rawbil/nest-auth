import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { //attatch it to auth module
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    //get jwt secret from config
    const jwtSecret = config.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new UnauthorizedException('Jwt secret is not provided in config');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { userId: string; email: string }) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.userId },
    });
    if (!user)
      throw new UnauthorizedException('oops... failed to validate user');
    return user; //attatches req.user to payload
  }
}
