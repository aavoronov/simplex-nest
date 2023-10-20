export type TTypeChat = 'group' | 'personal';

export interface IMessageBody {
  login: string;
  name: string | null;
  text: string;
  profilePic?: string;
  files?: {
    file: string;
    filename: string;
  }[];
  roomId: string;
  userId: number;
}

export interface IMessage {
  sender: string;
  //   room: string;
  message: string;
  //   emoji?: string;
}
export interface IRooms {
  sender: string;
}
export interface ISender {
  sender: string;
}
export interface IGetMessages {
  sender: string;
  room: string;
  page: string;
}
export interface IBodyCreate {
  name: string;
  description: string;
  type?: TTypeChat;
  users: string | number[];

  access: boolean;
  role: string;
  user: {
    id: number;
  };
}

export interface IRequestMessage {
  message: string;
  status: number;
  data?: any;
  files?: any;
}
