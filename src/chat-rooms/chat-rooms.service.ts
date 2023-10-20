import { HttpException, Injectable } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';

import { User } from '../users/entities/user.entity';

import { SignUpToRoomDto } from './dto/sign-up-to-room.dto';
import { ChatRoom } from './entities/chat-room.entity';
import { RoomAccess } from '../room-accesses/entities/room-access.entity';
import { Op } from 'sequelize';

@Injectable()
export class ChatRoomsService {
  async getRooms(req: any) {
    try {
      const token = req.headers.authorization;
      const result = jwt.verify(token, process.env.JWT);
      const user = await User.findOne({
        where: { login: result.email },
      });

      // // console.log('user', user);

      const chatRooms = await ChatRoom.findAll({
        // where: {
        //   '$EstateObject.EstateObjectRight.userId$': { [Op.eq]: user.id },
        // },
      });

      const roomsAvailable = chatRooms.map((item) => item.id);

      // console.log(roomsAvailable);

      const rooms = await ChatRoom.findAll({ where: { id: roomsAvailable } });
      return rooms;
    } catch (e) {
      // console.log('e', e);
    }
  }

  async getMyRooms(userId: number) {
    try {
      const chats1 = await ChatRoom.findAll({
        attributes: ['id'],
        include: [
          {
            model: RoomAccess,
            attributes: ['id'],
            include: [
              {
                model: User,
                where: {
                  id: { [Op.ne]: userId },
                },
                attributes: ['id', 'name', 'login', 'profilePic'],
              },
            ],
          },
        ],
      });
      const chats = await RoomAccess.findAll({
        where: { userId: userId },
        include: [{ model: ChatRoom, attributes: ['id'] }, { model: User }],
        attributes: ['id'],
      });
      return chats1;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async getUsers(id: number) {
    try {
      const users = await RoomAccess.findAll({
        where: { roomId: id },
        attributes: [],
        include: [
          {
            model: User,
            attributes: ['id', 'profilePic'],
          },
        ],
      });
      return { roomId: id, users: users };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async createTimeRecord(login: string, chat: number) {
    try {
      const user = await User.findOne({
        where: { login: login },
        attributes: ['id'],
      });
      // console.log(user.id, chat);
      const record = await RoomAccess.findOne({
        where: { userId: parseInt(user.id), roomId: chat },
      });

      record.changed('updatedAt', true);
      await record.update({
        updatedAt: new Date(),
      });
      return { userId: user.id, time: record.updatedAt, chat: chat };
      // { updatedAt: sequelize.literal('CURRENT_TIMESTAMP') },
      // // console.log(updated);
    } catch (e) {
      // console.log(e);
    }
  }
}
