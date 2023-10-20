import { Body, Controller, Get, Req } from '@nestjs/common';
import { Post, Query, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Base64 } from 'js-base64';
import { diskStorage } from 'multer';
import { ChatService } from './chat.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getMessages(@Body() body: { userId: number }) {
    // // console.log('fired');
    return this.chatService.getMessages(body.userId);
  }

  @Get('more')
  getMoreMessages(
    @Body() body: { userId: number },
    @Query('page') page: number,
    @Query('chat') chat: string,
  ) {
    return this.chatService.getMoreMessages(body.userId, page, chat);
  }

  // @Post()
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads/chat/',
  //       filename: (req, file, cb) => {
  //         try {
  //           const fileName = Base64.encodeURI(
  //             (Math.random() * 1000).toString() + Date.now(),
  //           );
  //           const dbFileName =
  //             fileName +
  //             file.originalname.slice(file.originalname.lastIndexOf('.'));
  //           req.body.filename = dbFileName;
  //           cb(null, `${dbFileName}`);
  //         } catch (e) {
  //           // console.log(e);
  //         }
  //       },
  //     }),
  //   }),
  // )
  // createMessage(@Body() payload: any) {
  //   return this.chatService.createMessage(payload);
  // }
}
