import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('create-user') //!POST /users/create-user
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);;
    }

    @Get('all-users') //!GET /users/all-users
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get(':id') //!GET /users/:id
    getSingleUser(@Param('id') id: string) {
        return this.usersService.getSingleUser(id);
    }
}
