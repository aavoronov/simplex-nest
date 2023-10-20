import { HttpException, Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessageBody, WebSocketServer } from '@nestjs/websockets/decorators';
import { writeFile } from 'fs';
import { StatusCodes } from 'http-status-codes';
import { Base64 } from 'js-base64';
import { Namespace, Socket, Server } from 'socket.io';
import { ChatRoomsService } from '../chat-rooms/chat-rooms.service';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';
import { IMessageBody } from './interfaces/interface';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

// import {
//   ClientToServerEvents,
//   ServerToClientEvents,
//   InterServerEvents,
//   SocketData,
// } from '../socket-io-adapter';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  message: (payload: MessagePayload) => void;
  newConnection: (payload?: string) => void;
  joinRoom: (userId: number) => void;
  leaveRoom: (userId: number) => void;
  users: (users: Array<string>) => void;
  // userConnected: (user: { userID: string; username?: string }) => void;
  // userDisconnected: (user: { userID: string; username?: string }) => void;
  userConnected: (userID: string) => void;
  userDisconnected: (userID: string) => void;
  pong: (timeRecord: { userId: number; time: string; chat: number }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

interface MessagePayload {
  message: string;
  name: string;
  createdAt: string;
  profilePic: string;
  files?: string[];
  roomId: string;
  userId: string;
}

interface AppServer<
  CtoS = ClientToServerEvents,
  StoC = ServerToClientEvents,
  StoS = InterServerEvents,
  Data = SocketData,
> extends Server<CtoS, StoC, StoS, Data> {
  username?: string;
}

interface AppNamespace<
  CtoS = ClientToServerEvents,
  StoC = ServerToClientEvents,
  StoS = InterServerEvents,
  Data = SocketData,
> extends Namespace<CtoS, StoC, StoS, Data> {}

interface AppSocket<
  CtoS = ClientToServerEvents,
  StoC = ServerToClientEvents,
  StoS = InterServerEvents,
  Data = SocketData,
> extends Socket<CtoS, StoC, StoS, Data> {
  username?: string;
  sessionID: string;
  userID: string;
}

@WebSocketGateway({
  namespace: 'chat',
})
@Injectable()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatRoomsService: ChatRoomsService) {}
  randomId() {
    // console.warn('randomId');
    return crypto.randomBytes(8).toString('hex');
  }

  async onInit(socket: AppSocket) {
    // const sessionID = socket.handshake.auth.sessionID;
    // if (sessionID) {
    //   const session = sessionStore.findSession(sessionID);
    //   if (session) {
    //     socket.sessionID = sessionID;
    //     socket.userID = session.userID;
    //     socket.username = session.username;
    //     return;
    //   }
    // }
    const token = socket.handshake.auth.token;
    // console.log(token);

    // if (!token) {
    //   throw new Error('invalid username');
    // }

    const result = jwt.verify(token, process.env.JWT);
    const user = await User.findOne({
      where: { id: result.id },
    });
    // socket.sessionID = this.randomId();
    socket.userID = user.id;

    // const users = [];
    const users: Set<string> = new Set();

    this.io.sockets.forEach((socket: AppSocket) => {
      users.add(
        socket.userID,
        // username: userID,
      );
    });

    // for (const [id, socket] of this.io.sockets) {
    //   // console.log(socket);
    //   users.push({
    //     userID: socket.userID,
    //     // username: userID,
    //   });
    // }
    // console.log('users', users);

    socket.emit('users', Array.from(users));
    // TODO only emit to rooms belonging to the client
    socket.broadcast.emit('userConnected', socket.userID);

    // socket.appUserId = user.id;
  }

  @WebSocketServer() io: AppNamespace;

  // @WebSocketServer() io: AppServer;

  afterInit() {
    console.log('initialized');
  }

  // io.on("connection", (socket) => {
  //   const users = [];
  //   for (let [id, socket] of io.of("/").sockets) {
  //     users.push({
  //       userID: id,
  //       username: socket.username,
  //     });
  //   }
  //   socket.emit("users", users);
  //   // ...
  // });

  async handleConnection(client: AppSocket) {
    // const sockets = this.io.sockets;
    console.log('c');
    // console.log(sockets.size);

    // console.log({ userId });
    // console.log('token', token);
    // client.emit('newConnection', 'all except');
    await this.onInit(client);

    // const users = [];
  }

  handleDisconnect(client: AppSocket) {
    // const sockets = this.io.sockets;
    console.log('dc');

    // const matchingSockets = await this.io.fetchSockets();
    // const isDisconnected = matchingSockets.size === 0;
    // if (isDisconnected) {
    // notify other users
    client.broadcast.emit('userDisconnected', client.userID);
    // }
    // console.log(sockets.size);

    // this.users.forEach((user) => {
    //   if (user.self) {
    //     user.connected = false;
    //   }
    // });
  }

  // @SubscribeMessage('*')
  // handleAnything(client: AppSocket, args: any[]) {
  //   console.log('wildcard event');
  // }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: AppSocket, [rooms, userId]: [string[], number]): void {
    // const [rooms, userId] = args;
    client.join(rooms);
    // console.log(client.rooms);
    // console.log(room);
    // console.log('joinRoom', rooms, userId);

    // this.io.to(room).emit('joinRoom');

    this.io.to(rooms).emit<'joinRoom'>('joinRoom', userId);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(
    client: AppSocket,
    [rooms, userId]: [string[], number],
  ): void {
    // const [rooms, userId] = args;
    rooms.forEach((room) => client.leave(room));

    // console.log(client.rooms);
    // console.log(room);
    // console.log('leaveRoom', rooms, userId);

    // this.io.to(room).emit('joinRoom');
    this.io.emit('leaveRoom', userId);
  }

  @SubscribeMessage('ping')
  async handlePing(client: AppSocket, args: any[]) {
    console.log(args);
    const [login, chat] = args;
    console.log('ping');
    // console.log('ping!', email, chat);
    const timeRecord = await this.chatRoomsService.createTimeRecord(
      login,
      chat,
    );
    client.broadcast.emit('pong', timeRecord);
  }

  @SubscribeMessage('message')
  async handleNewMessage(
    @MessageBody() message: IMessageBody,
    // @MessageBody() file: any,
  ): Promise<void> {
    try {
      // console.log(message);
      const user = await User.findOne({
        where: { login: message.login },
        attributes: ['id'],
      });
      // // console.log(user.id);
      const dbFileNames: string[] = [];

      if (message.files?.length) {
        message.files.forEach((item) => {
          const fileName = Base64.encodeURI(
            (Math.random() * 1000).toString() + Date.now(),
          );
          // console.log(item);

          const fileNameWithExtension =
            fileName + item.filename.slice(item.filename.lastIndexOf('.'));

          dbFileNames.push(fileNameWithExtension);

          // console.log(item.filename.slice(item.filename.lastIndexOf('.')));

          const myBuffer = Buffer.from(item.file, 'base64');

          writeFile(
            `./uploads/chat/${fileNameWithExtension}`,
            myBuffer,
            (err) => {
              console.log(err);
            },
          );
        });
      }

      const newMessage = await Message.create({
        userId: user.id,
        message: message.text,
        files: dbFileNames,
        roomId: parseInt(message.roomId),
      });

      if (!newMessage) {
        throw new HttpException('Ошибка', StatusCodes.BAD_REQUEST, {
          cause: new Error('Some Error'),
        });
      }

      const file = !!message.files?.length ? dbFileNames : undefined;
      // console.log(file);
      const payload: MessagePayload = {
        // email: message.email,
        message: message.text,
        name: message.name,
        createdAt: newMessage.createdAt,
        profilePic: message.profilePic,
        files: dbFileNames,
        roomId: message.roomId,
        userId: user.id,
      };
      // console.log(payload);
      // console.log('emits');
      this.io.to(message.roomId).emit('message', payload);
    } catch (e) {
      console.log(e);
    }
  }
}
