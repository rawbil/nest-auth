import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    //!Create User
    async createUser() {
        
    }
    
    //!Get all users

    //!Get user with id

    //!Update user with id

    //!Delete user
}
