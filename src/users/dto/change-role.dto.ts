/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class ChangeRoleDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  role: string;
}
