import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { hashPassword } from 'src/auth/utils/passwords';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

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
      newUser,
    };
  }

  //!Get all users
  async getAllUsers() {
    const users = await this.prisma.users.findMany();
    return {
      success: true,
      message: 'Users fetched successfully',
      users,
    };
  }

  //!Get user with id
  async getSingleUser(id: string) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User: "${id}" not found`);
    }

    return {
      success: true,
      message: `User '${user.email}' fetched successfully`,
      user,
    };
  }

  //!Update user with id
  async updateUser(id: string, data: Prisma.UsersUpdateInput) {
    //check if user with given id exists
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User '${id}' not found`);
    }

    //check for email
    if (data.email) {
      const emailExists = await this.prisma.users.findUnique({
        where: { email: data.email as string },
      });
      if (emailExists) {
        throw new ConflictException(
          `Email '${data.email}' already in use :( )`,
        );
      }
    }

    const updatedUser = await this.prisma.users.update({ where: { id }, data });

    return {
      success: true,
      message: 'User updated successfully',
      updatedUser,
    };
  }

  //!Delete user
  async deleteUser(id: string) {
    const user = await this.prisma.users.findUnique({where: {id}});
    if(!user) {
        throw new NotFoundException("User to delete not found");
    }

    const deletedUser = await this.prisma.users.delete({where: {id}});
    return {
        success: true,
        message: "User deleted successfully",
        deletedUser
    }
  }
}
