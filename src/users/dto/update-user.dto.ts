import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  readonly name: string;

  @ApiProperty({ required: true })
  readonly userId: number;
}
