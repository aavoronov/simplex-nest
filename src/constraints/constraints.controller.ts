import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ConstraintsService } from './constraints.service';
import { CreateConstraintDto } from './dto/create-constraint.dto';
import { UpdateConstraintDto } from './dto/update-constraint.dto';

@Controller('constraints')
export class ConstraintsController {
  constructor(private readonly constraintsService: ConstraintsService) {}

  @Post()
  create(@Body() body: any) {
    return this.constraintsService.create(body);
  }

  @Get()
  findAll() {
    return this.constraintsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.constraintsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConstraintDto: UpdateConstraintDto,
  ) {
    return this.constraintsService.update(+id, updateConstraintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.constraintsService.remove(+id);
  }
}
