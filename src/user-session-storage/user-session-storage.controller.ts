import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserSessionStorageService } from './user-session-storage.service';
import { CreateUserSessionStorageDto } from './dto/create-user-session-storage.dto';
import { UpdateUserSessionStorageDto } from './dto/update-user-session-storage.dto';

@Controller('user-session-storage')
export class UserSessionStorageController {
  constructor(
    private readonly userSessionStorageService: UserSessionStorageService,
  ) {}
}
