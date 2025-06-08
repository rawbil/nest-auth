import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @IsStrongPassword()
    newPassword: string;
}