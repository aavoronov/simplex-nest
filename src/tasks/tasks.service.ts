import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { StatusCodes } from 'http-status-codes';
import { Op, Sequelize } from 'sequelize';

import { Message } from '../chat/entities/message.entity';

import { ChatGateway } from '../chat/chat.gateway';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Timeout(5000)
  // handleTimeout1() {
  //   this.logger.debug('Called once after 5 seconds');
  // }

  @Timeout(30 * 1000)
  async handleTimeout() {
    const admin = await User.findOne({
      where: { login: 'admin@example.com', role: 'admin' },
    });

    this.logger.debug(!!admin && 'admin exists');

    if (!admin) {
      await User.create({
        login: 'admin@example.com',
        password:
          '$2b$10$wYFl4Y1lSzc2SHmsaKN9k.NdXhL8xgGXJFjWN5B4vJNvUHenF7iCW',
        role: 'admin',
        name: 'admin',
      });
      this.logger.debug(!!admin && 'admin created');
    }
  }
}
