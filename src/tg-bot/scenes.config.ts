export interface IReply {
  type: string;
  message?: string;
  src?: string;
}

export interface IButton {
  text: string;
  callback_data: string;
  value?: string;
}

export interface IStoryStep {
  replies: IReply[];
  buttons: IButton[][];
}

export const scenes = {
  start: {
    replies: [{ type: 'text', message: 'Ответить на вопросы' }],
    buttons: [[{ text: 'Начать', callback_data: 'null:question1' }]],
  },
  question1: {
    replies: [
      { type: 'text', message: 'Вопрос 1' },
      {
        type: 'image',
        src: 'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg',
      },
    ],
    buttons: [
      [{ text: '1', callback_data: '1:question2', value: '1' }],
      [{ text: '2', callback_data: '2:question2', value: '1' }],
      [{ text: '3', callback_data: '3:question2', value: '1' }],
    ],
  },
  question2: {
    replies: [{ type: 'text', message: 'Вопрос 2' }],
    buttons: [
      [{ text: '4', callback_data: '4:question3', value: '1' }],
      [{ text: '5', callback_data: '5:question3', value: '1' }],
      [{ text: '6', callback_data: '6:question3', value: '1' }],
    ],
  },
  question3: {
    replies: [{ type: 'text', message: 'Вопрос 3' }],
    buttons: [
      [{ text: '7', callback_data: '7:end', value: '1' }],
      [{ text: '8', callback_data: '8:end', value: '1' }],
      [{ text: '9', callback_data: '9:end', value: '1' }],
    ],
  },
  end: {
    replies: [{ type: 'text', message: 'Конец' }],
    buttons: [[{ text: 'Ладно', callback_data: 'quit' }]],
  },
};
