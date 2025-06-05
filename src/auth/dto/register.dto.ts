import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsStrongPassword()
    password: string;

    @IsEmail()
    email: string;
}