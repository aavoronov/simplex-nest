import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { Category } from '@/src/categories/entities/category.entity';
import { User } from '@/src/users/entities/user.entity';
import { Constraint } from '@/src/constraints/entities/constraint.entity';
import { App } from '@/src/apps/entities/app.entity';
import { Product } from '@/src/products/entities/product.entity';
import { PhoneVerification } from '@/src/phone-verifications/entities/phone-verification.entity';
import { GlobalCategory } from '@/src/global-categories/entities/global-category.entity';
import { Purchase } from '@/src/purchases/entities/purchase.entity';
import { Review } from '@/src/reviews/entities/review.entity';
import { TelegramCredential } from '@/src/telegram-credentials/entities/telegram-credential.entity';
import { UserSessionStorage } from '@/src/user-session-storage/entities/user-session-storage.entity';
import { ChatRoom } from '@/src/chat-rooms/entities/chat-room.entity';
import { Message } from '@/src/chat/entities/message.entity';
import { RoomAccess } from '@/src/room-accesses/entities/room-access.entity';

const entities = [
  User,
  PhoneVerification,
  Category,
  Constraint,
  App,
  Product,
  GlobalCategory,
  Purchase,
  Review,
  ChatRoom,
  RoomAccess,
  Message,

  TelegramCredential,
  UserSessionStorage,
];
export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels(entities);
      await sequelize.sync();
      // await sequelize.sync({ force: true });
      return sequelize;
    },
  },
];
