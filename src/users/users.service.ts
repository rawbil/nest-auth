import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { hashPassword } from 'src/auth/utils/passwords';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  //!Create User
  async createUser(data: Prisma.UsersCreateInput) {
    //check if email already exists
    const emailExists = await this.prisma.users.findUnique({
      where: { email: data.email },
    });
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    //hash password
    const hashedPassword = await hashPassword(data.password);

    const newUser = await this.prisma.users.create({
      data: {
        username: data.username,
        password: hashedPassword,
        email: data.email,
      },
    });

    return {
        success: true,
        message: `User ${data.email} created successfully!`,
        newUser
    }
  }

  //!Get all users

  //!Get user with id

  //!Update user with id

  //!Delete user
}
