import { Module } from '@nestjs/common';
import { UserSessionStorageService } from './user-session-storage.service';
import { UserSessionStorageController } from './user-session-storage.controller';

@Module({
  controllers: [UserSessionStorageController],
  providers: [UserSessionStorageService],
  exports: [UserSessionStorageService],
})
export class UserSessionStorageModule {}
