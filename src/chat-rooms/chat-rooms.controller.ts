import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatRoomsService } from './chat-rooms.service';
import { RegisterWorkerObjectDto } from './dto/register-worker-object.dto';
import { SignUpToRoomDto } from './dto/sign-up-to-room.dto';

@ApiTags('chat-rooms')
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Get()
  getMyRooms(@Body() body: { userId: number }) {
    return this.chatRoomsService.getMyRooms(body.userId);
  }

  @Get('room/:id/users')
  getUsers(@Param('id') id: number) {
    return this.chatRoomsService.getUsers(id);
  }
}
