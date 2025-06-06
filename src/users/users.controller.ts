import { Body, Controller, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

    @Get('get/:id') //!GET /users/get/:id
    getSingleUser(@Param('id') id: string) {
        return this.usersService.getSingleUser(id);
    }

    @Patch('update/:id') //!PATCH /users/update/:id
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(id, updateUserDto);
    }
}
