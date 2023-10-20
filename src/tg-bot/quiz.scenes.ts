import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update } from 'telegraf/typings/core/types/typegram';

/* just some service to save data in SQL database */
// import { UserSessionStorageService } from '../../storages';

/* import json (and its interface) described above */
import { IStoryStep, scenes } from './scenes.config';
import { UserSessionStorageService } from '../user-session-storage/user-session-storage.service';
import { Injectable } from '@nestjs/common';
import { UserSessionStorage } from '../user-session-storage/entities/user-session-storage.entity';
// import { IStoryStep } from '../../types';
// import notValidatedStoryJson from './story.json';

const storySteps: Record<string, IStoryStep> = scenes;

const getUserId = (context: Context): number => {
  if ('callback_query' in context.update) {
    return context.update.callback_query.from.id;
  }

  if ('message' in context.update) {
    return context.update.message.from.id;
  }

  if ('my_chat_member' in context.update) {
    return context.update.my_chat_member.from.id;
  }

  return -1;
};

@Injectable()
@Scene('start')
export class StoryScene {
  constructor(private readonly userSessionService: UserSessionStorageService) {}

  @SceneEnter()
  async start(@Ctx() context: SceneContext) {
    const userId = getUserId(context);
    // console.log(await this.userSessionService.getUserStoryStep());
    const currentStep =
      (await this.userSessionService.getUserStoryStep()) || 'start';
    console.log('currentStep', currentStep);
    const { buttons, replies } = storySteps[currentStep];

    // await context.reply('2+2 = ?', {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [{ text: 'Может быть 4?', callback_data: '4' }],
    //       [{ text: 'Точно пять!', callback_data: '5' }],
    //     ],
    //   },
    // });

    const getReplies = async () => {
      const replies = (await UserSessionStorage.findOne({ where: { id: 1 } }))
        .replies;
      return 'Ваши ответы: ' + replies;
    };

    const message =
      currentStep === 'end' ? await getReplies() : replies[0].message;

    await context.reply(message, {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });

    // ... (send message or media) + buttons
  }

  @Action(/.*/)
  async onAnswer(
    @Ctx() context: SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const userId = getUserId(context);
    const cbQuery = context.update.callback_query;
    // const nextStep = 'data' in cbQuery ? cbQuery.data : null;
    const [value, nextStep] =
      'data' in cbQuery ? cbQuery.data.split(':') : [null, null];
    console.log(cbQuery);
    console.log(value, nextStep);

    if (nextStep === 'quit') {
      context.scene.leave();
    } else {
      await this.userSessionService.updateUserSession(nextStep);
      if (value !== 'null') {
        await this.userSessionService.updateReplies(value);
      }
      await context.scene.reenter();
    }
  }
}
