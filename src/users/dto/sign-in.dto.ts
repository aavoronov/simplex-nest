import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ required: true })
  readonly login: string;

  @ApiProperty({ required: true })
  readonly password: string;
}
