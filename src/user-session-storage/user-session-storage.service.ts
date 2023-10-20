import { Injectable } from '@nestjs/common';
import { CreateUserSessionStorageDto } from './dto/create-user-session-storage.dto';
import { UpdateUserSessionStorageDto } from './dto/update-user-session-storage.dto';
import { UserSessionStorage } from './entities/user-session-storage.entity';

@Injectable()
export class UserSessionStorageService {
  async updateUserSession(storyStep: string) {
    let record = await UserSessionStorage.findOne({ where: { id: 1 } });
    if (!record) {
      record = await UserSessionStorage.create({ storyStep });
    }
    await record.update({ storyStep });
    return record.storyStep;
  }

  async getUserStoryStep() {
    const record = await UserSessionStorage.findOne({ where: { id: 1 } });
    return record?.storyStep || null;
  }

  async updateReplies(reply: string) {
    const record = await UserSessionStorage.findOne({ where: { id: 1 } });
    const replies = record.replies + reply + ', ';
    await record.update({ replies });
  }
}
