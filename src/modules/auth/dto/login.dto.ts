import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  loginOrEmail: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
