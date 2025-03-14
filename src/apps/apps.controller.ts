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
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  create(@Body() createAppDto: CreateAppDto) {
    return this.appsService.create(createAppDto);
  }

  @Get()
  getAllApps(
    @Query('page') page: number,
    @Query('type') type?: 'apps' | 'games',
    @Query('search') search?: string,
  ) {
    return this.appsService.getAllApps(page, type, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appsService.getOneApp(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppDto: UpdateAppDto) {
    return this.appsService.update(+id, updateAppDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appsService.remove(+id);
  }
}
