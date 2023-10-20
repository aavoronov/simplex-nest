// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class TelegrafService {}

import { Update, Ctx, Start, Help, On, Hears } from 'nestjs-telegraf';
import { TelegrafContext } from './tg-bot-context.interface';
import { Message } from 'telegraf/typings/core/types/typegram';
import { TelegramCredential } from '../telegram-credentials/entities/telegram-credential.entity';
// import { Message } from 'typegram';
// type TelegrafContext = any;
// import { TelegrafContext } from './common/interfaces/telegraf-context.interface.ts';
// interface TelegrafContextWithLocation extends TelegrafContext {
//   location: { latitude: number; longitude: number };
// }

// type TelegrafContextWithLocation = TelegrafContext &
// type MessageWithLocation = New & NonChannel & TextMessage

@Update()
export class TgBotService {
  @Start()
  async start(@Ctx() ctx: TelegrafContext) {
    try {
      const message = ctx.message as Message.TextMessage;
      console.log(message.text);
      const token = message.text.split(' ')[1];
      if (!token) {
        await ctx.reply('Не введен токен пользователя');
        throw new Error('не введен токен');
      }
      console.log(token);
      const cred = await TelegramCredential.findOne({
        where: { token: token },
      });
      if (!cred) {
        await ctx.reply('Пользователь не найден');
      } else {
        await cred.update({ chatId: ctx.message.chat.id });
        await ctx.reply('Теперь вы сможете получать уведомления');
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Help()
  async help(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async on(@Ctx() ctx: TelegrafContext) {
    console.log(ctx.message);
    await ctx.reply('👍');
  }

  @Hears('привет')
  async onHello(@Ctx() ctx: TelegrafContext) {
    console.log(ctx.message);
    await ctx.reply(`привет ${ctx.message.from.first_name}`);
  }

  @Hears('/quiz')
  async onQuiz(@Ctx() ctx: TelegrafContext) {
    // console.log(ctx.message);
    try {
      // console.log(ctx);
      await ctx.scene.enter('start');
    } catch (e) {
      console.log(e);
    }
  }

  @Hears('/debug')
  async onDebug(@Ctx() ctx: TelegrafContext) {
    console.log(ctx.message);
    await ctx.reply(JSON.stringify(ctx.message, null, 2));
  }

  @Hears('/test')
  async onTest(@Ctx() ctx: TelegrafContext) {
    console.log(ctx.message);
    await ctx.reply('Welcome', {
      reply_markup: {
        inline_keyboard: [
          /* Inline buttons. 2 side-by-side */
          [
            { text: 'Button 1', callback_data: 'btn-1' },
            { text: 'Button 2', callback_data: 'btn-2' },
          ],

          /* One button */
          [{ text: 'Next', callback_data: 'next' }],

          /* Also, we can have URL buttons. */
          [{ text: 'Open in browser', url: 'telegraf.js.org' }],
        ],
      },
    });
  }

  @On('location')
  async onWeather(@Ctx() ctx: TelegrafContext) {
    // console.log(ctx.message);

    const message = ctx.message as Message.LocationMessage;

    try {
      const weatherAPIUrl = `http://api.weatherapi.com/v1/current.json?q=${message.location?.latitude},${message.location?.longitude}&key=${process.env.WEATHER_API_KEY}`;
      const response = await globalThis.fetch(weatherAPIUrl);
      const json = await response.json();
      console.log(json);
      console.log(json.location.name, json.condition, json.current.temp_c);
      await ctx.reply(
        `погода в ${json.location.name}: ${json.current.condition.text} ${json.current.temp_c} °C`,
      );
    } catch (e) {
      console.log(e);
    }
  }

  @On('message')
  async onMessage(@Ctx() ctx: TelegrafContext) {
    console.log(ctx.message);
    await ctx.reply('👍1');
  }
}
