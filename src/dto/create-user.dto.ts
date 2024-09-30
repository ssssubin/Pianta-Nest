import { IsEmail, IsString } from "class-validator";

export class createUserDto {
   @IsEmail()
   readonly email: string;
   @IsString()
   readonly name: string;
   @IsString()
   readonly password: string;
   @IsString()
   readonly address: string;
   @IsString()
   readonly phone_number: string;
}
