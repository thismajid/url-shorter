/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class ChangeProfileDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
