import { IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'Login can only include letters, numbers, "_" and "-".',
  })
  login: string;

  @IsString()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Must be a valid email address (e.g., example@example.com).',
  })
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
