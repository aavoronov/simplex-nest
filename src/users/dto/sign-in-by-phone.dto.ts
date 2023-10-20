import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class SignInByPhoneDto {
  @ApiProperty({ required: true })
  readonly phone: string;

  @ApiProperty({ required: true })
  readonly otp: string;
}
