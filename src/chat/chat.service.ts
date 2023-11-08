import { HttpException, Injectable } from '@nestjs/common';
// import * as async from 'async';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { RoomAccess } from '../room-accesses/entities/room-access.entity';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';
import { IRequestMessage } from './interfaces/interface';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Op } from 'sequelize';

@Injectable()
export class ChatService {
  // async createMessage(payload: any): Promise<void> {
  //   try {
  //     // console.log(payload);
  //     const { sender, message, filename, roomId } = payload;

  //     //   const permissions = await ChatPermissions.findAll({
  //     //     where: { chatId: room, userId: { [Op.ne]: sender } },
  //     //     attributes: ['userId'],
  //     //   });

  //     const user = await User.findOne({
  //       where: { login: sender },
  //       attributes: ['id'],
  //     });
  //     // console.log(user.id);
  //     const newMessage = await Message.create({
  //       // chat: room,
  //       userId: user.id,
  //       message,
  //       files: filename,
  //       roomId: parseInt(roomId),
  //     });

  //     //   await ReaderModel.bulkCreate(
  //     //     permissions.map((value) => ({
  //     //       userId: value.userId,
  //     //       messageId: newMessage.id,
  //     //     })),
  //     //   );

  //     if (!newMessage) {
  //       throw new HttpException('Ошибка', StatusCodes.BAD_REQUEST, {
  //         cause: new Error('Some Error'),
  //       });
  //     }
  //     // console.log('ok');
  //   } catch (e) {
  //     // console.log(e);
  //     throw new HttpException(e.message, e.status, {
  //       cause: new Error('Some Error'),
  //     });
  //   }
  // }

  private async getMessagesPerRoom(
    room: number,
    userId: number,
    limit: number,
    offset: number,
  ) {
    const everyonesLastVisits = (
      await RoomAccess.findAll({
        where: { roomId: room },
        attributes: ['updatedAt'],
      })
    ).map((item) => item.updatedAt);

    console.log(everyonesLastVisits);
    const perRoom = await Message.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
      where: { roomId: room },
      attributes: ['id', 'message', 'files', 'roomId', 'createdAt'],
      order: [['id', 'DESC']],
      limit,
      offset,
    });

    const plainPerRoom = perRoom.map((x) => x.get({ plain: true }));

    const perRoomWithDeliveryStatus = plainPerRoom.map((message) => {
      const delivered: boolean = everyonesLastVisits.every((time) => {
        return time > message.createdAt;
      });
      return { ...message, delivered };
    });
    return perRoomWithDeliveryStatus;
  }

  //   async getMessages(body: IGetMessages): Promise<IRequestMessage> {
  async getMessages(userId: number): Promise<IRequestMessage> {
    const limit = 20;
    const page = 1;
    const offset = page * limit - limit;

    try {
      const access = await RoomAccess.findAll({
        include: [{ model: User, where: { id: userId }, attributes: ['id'] }],
      });

      const rooms = access.map((item) => item.roomId);

      // console.log(rooms);

      // const results = await async.map(rooms, getMessagesPerRoom);
      const results = await Promise.all(
        rooms.map((room) =>
          this.getMessagesPerRoom(room, userId, limit, offset),
        ),
      );

      const msgs = results.flat().sort((a, b) => {
        const idA = a.id;
        const idB = b.id;
        if (idA < idB) {
          return -1;
        }
        if (idA > idB) {
          return 1;
        }
        return 0;
      });

      return {
        status: StatusCodes.OK,
        message: 'Ok',
        // data: results.map((value) => value.toJSON()),
        data: msgs,
      };
    } catch (e) {
      return { status: StatusCodes.BAD_REQUEST, message: 'Ошибка', data: e };
      // // console.log(e);
    }
  }

  async getMoreMessages(
    userId: number,
    page: number,
    chat: string,
  ): Promise<IRequestMessage> {
    const limit = 20;
    //   const page = parseInt(body.page) || 1;
    const offset = page * limit - limit;

    const access = await RoomAccess.findAll({
      include: [{ model: User, where: { id: userId }, attributes: ['id'] }],
    });

    const rooms = access.map((item) => item.roomId);

    // console.log(rooms);

    if (!rooms.includes(parseInt(chat))) {
      throw new HttpException(
        'Вы не зарегистрированы в этом чате',
        StatusCodes.FORBIDDEN,
        {
          cause: new Error('Some Error'),
        },
      );
    }

    const results = await this.getMessagesPerRoom(
      parseInt(chat),
      userId,
      limit,
      offset,
    );

    const msgs = results.flat().sort((a, b) => {
      const idA = a.id;
      const idB = b.id;
      if (idA < idB) {
        return -1;
      }
      if (idA > idB) {
        return 1;
      }
      return 0;
    });

    return {
      status: StatusCodes.OK,
      message: 'Ok',
      // data: results.map((value) => value.toJSON()),
      data: msgs,
    };
  }

  getFile(image: string, res: any): any {
    return res.sendFile(image, { root: './uploads' });
  }

  // async getUserFromSocket(socket: Socket) {
  //   let token = socket.handshake.headers.authorization;

  //   const user = this.usersService.getUserFromAuthenticationToken(token);

  //   if (!user) {
  //     throw new WsException('Invalid credentials.');
  //   }
  //   return user;
  // }
}
