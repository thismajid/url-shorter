/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  username?: string;

  @IsNotEmpty()
  password?: string;

  @IsNotEmpty()
  remember?: string;
}
