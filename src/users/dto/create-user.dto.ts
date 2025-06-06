import { IsEmail, IsString, IsNotEmpty, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}