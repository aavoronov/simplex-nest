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
import { ChatModule } from './chat/chat.module';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';

import { AdminModule } from '@adminjs/nestjs';
import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/sequelize';
import { resources } from './core/entities';
import { authenticate } from './core/authenticate';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

const modules = [
  DatabaseModule,
  MailerModule,
  TasksModule,

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

AdminJS.registerAdapter({ Database, Resource });
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: resources,
          // componentLoader,
        },
        auth: {
          authenticate,
          cookieName: 'adminjs',
          cookiePassword: 'secretwhatwouldthatbe',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secretwhatever',
        },
      }),
    }),
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
      { path: '/users/', method: RequestMethod.PATCH },

      // '/users/edit',
      // '/users/send-verification',
      // '/users/subscribe',
      // '/users/payment-info',
      // '/users/subscribe',
      // '/users/unsubscribe',
      // { path: '/users/', method: RequestMethod.DELETE },
      '/generic-data/',
    );
  }
}
