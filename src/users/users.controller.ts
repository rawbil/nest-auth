import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Post('create-user') //!POST /users/create-user
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);;
    }

    @UseGuards(JwtAuthGuard)
    @Get('all-users') //!GET /users/all-users
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get('get/:id') //!GET /users/get/:id
    getSingleUser(@Param('id') id: string) {
        return this.usersService.getSingleUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/:id') //!PATCH /users/update/:id
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id') //!DELETE /users/delete/:id
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
