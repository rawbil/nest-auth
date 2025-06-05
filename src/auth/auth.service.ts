import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hashPassword } from './utils/passwords';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    //!REGISTER
    async register(registerDto: RegisterDto) {
        const {username, email, password} = registerDto;
        //check if user with the provided email exists
        const emailExists = await this.prisma.users.findUnique({where: {email}});
        if(emailExists) {
            throw new ConflictException("Invalid credentials. Try again")
        }

        //hash password
        const hashedPassword = await hashPassword(password);

        const newUser = await this.prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        return {
            success: true,
            message: "User created successfully",
            newUser
        }

    }

    //!LOGIN
    async login(loginDto: LoginDto) {}

}
