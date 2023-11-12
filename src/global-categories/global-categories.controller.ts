import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GlobalCategoriesService } from './global-categories.service';
import { CreateGlobalCategoryDto } from './dto/create-global-category.dto';
import { UpdateGlobalCategoryDto } from './dto/update-global-category.dto';

@Controller('global-categories')
export class GlobalCategoriesController {
  constructor(
    private readonly globalCategoriesService: GlobalCategoriesService,
  ) {}

  @Get()
  getGlobalCategories() {
    return this.globalCategoriesService.getGlobalCategories();
  }

  @Get(':id')
  getOneGlobalCategory(@Param('id') id: string) {
    return this.globalCategoriesService.getOneGlobalCategory(+id);
  }
}
