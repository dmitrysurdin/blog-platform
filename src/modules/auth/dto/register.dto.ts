import { IsString, IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 10)
  login: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
