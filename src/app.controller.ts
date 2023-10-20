import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('uploads/:slug*')
  seeUploadedFile(@Param() params: string[], @Res() res: any) {
    return this.appService.getFile(params, res);
  }
}
