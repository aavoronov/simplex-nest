import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseDto {
  @ApiProperty({ required: true })
  readonly productId: string;

  @ApiProperty({ required: true })
  readonly userId: number;
}
