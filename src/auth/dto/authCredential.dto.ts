import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthCredentialDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
