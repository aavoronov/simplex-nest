import { ApiProperty } from '@nestjs/swagger';

export class SendOneClickCredentialsDto {
  @ApiProperty({ required: true })
  readonly email: string;

  @ApiProperty({ required: true })
  readonly login: string;

  @ApiProperty({ required: true })
  readonly password: string;
}
