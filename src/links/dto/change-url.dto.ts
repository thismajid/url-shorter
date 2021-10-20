/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class ChangeUrlDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  previousNameLink: string;

  @IsNotEmpty()
  name: string;
}
