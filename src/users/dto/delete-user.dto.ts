/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty()
  id: string;
}
