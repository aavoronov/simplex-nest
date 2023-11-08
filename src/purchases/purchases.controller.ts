import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { StatusType } from './entities/purchase.entity';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  createPurchase(@Body() body: CreatePurchaseDto) {
    return this.purchasesService.createPurchase(body);
  }

  @Get('my')
  getMyPurchases(@Body() body: { userId: number }) {
    return this.purchasesService.getMyPurchases(body);
  }
  @Get('sales')
  getMySales(
    @Body() body: { userId: number },
    @Query() queries: Record<string, string>,
  ) {
    return this.purchasesService.getMySales(body, queries);
  }

  @Patch(':id')
  changePurchaseStatus(
    @Param('id') id: string,
    @Body() body: { userId: number; status: StatusType },
  ) {
    return this.purchasesService.changePurchaseStatus(+id, body);
  }
}
