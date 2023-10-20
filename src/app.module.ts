import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  UseFilters,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppsModule } from './apps/apps.module';
import { CategoriesModule } from './categories/categories.module';
import { ConstraintsModule } from './constraints/constraints.module';
import { DatabaseModule } from './core/database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { ProductsModule } from './products/products.module';
import { PurchasesModule } from './purchases/purchases.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './utils/middleware/auth.middleware';
import { ReviewsModule } from './reviews/reviews.module';
import { GlobalCategoriesModule } from './global-categories/global-categories.module';

import { session } from 'telegraf';
import { ChatModule } from './chat/chat.module';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';

const modules = [
  DatabaseModule,
  MailerModule,

  UsersModule,
  CategoriesModule,
  ConstraintsModule,
  AppsModule,
  ProductsModule,
  PurchasesModule,
  ReviewsModule,
  GlobalCategoriesModule,
  ChatModule,
  ChatRoomsModule,
];

@Module({
  imports: [
    ConfigModule.forRoot(),

    // TelegrafModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     token: configService.get<string>(process.env.TELEGRAM_BOT_TOKEN),
    //     launchOptions: {
    //       webhook: {
    //         domain: 'domain.tld',
    //         hookPath: '/secret-path',
    //       },
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),

    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      '/purchases/',
      { path: '/reviews/', method: RequestMethod.POST },
      { path: '/products/', method: RequestMethod.POST },
      { path: '/products/:id', method: RequestMethod.PATCH },
      { path: '/products/my', method: RequestMethod.GET },
      { path: '/chat-rooms/', method: RequestMethod.ALL },
      '/chat/more',
      // '/products/:id',
      '/users/reauth',

      '/users/edit',
      '/users/send-verification',
      '/users/subscribe',
      '/users/payment-info',
      '/users/subscribe',
      '/users/unsubscribe',
      { path: '/users/', method: RequestMethod.DELETE },
      '/generic-data/',
    );
  }
}
