import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalCategoryDto } from './create-global-category.dto';

export class UpdateGlobalCategoryDto extends PartialType(CreateGlobalCategoryDto) {}
