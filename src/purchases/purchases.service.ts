import { HttpException, Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase, StatusType } from './entities/purchase.entity';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Product } from '../products/entities/product.entity';
import { ChatRoom } from '../chat-rooms/entities/chat-room.entity';
import { RoomAccess } from '../room-accesses/entities/room-access.entity';
import { Category } from '../categories/entities/category.entity';
import { App } from '../apps/entities/app.entity';
import { getWhereClause } from '../utils/functions';

@Injectable()
export class PurchasesService {
  private async deleteRoom(id: number) {
    const room = await ChatRoom.destroy({ where: { id }, cascade: true });
    return room;
  }

  async createPurchase(body: CreatePurchaseDto) {
    const { productId, userId } = body;
    console.log({ productId, userId });

    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      throw new HttpException('Товар не существует', StatusCodes.BAD_REQUEST, {
        cause: new Error('Some Error'),
      });
    }

    const purchase = await Purchase.create({
      productId: +productId,
      userId: userId,
    });

    const ids = [userId, product.userId].sort((a, b) => a - b);
    const chatName = ids[0] + '-' + ids[1];

    const existingChat = await ChatRoom.findOne({ where: { name: chatName } });

    if (!existingChat) {
      const chat = await ChatRoom.create({ name: chatName });
      await Promise.all(
        ids.map((item) => RoomAccess.create({ roomId: chat.id, userId: item })),
      );
    }

    return purchase;
  }

  async getMyPurchases(body: { userId: number }) {
    const purchases = await Purchase.findAll({
      where: { userId: body.userId },
      attributes: ['id', 'status', 'sum', 'createdAt'],
      include: [
        {
          model: Product,
          include: [
            {
              model: Category,
              attributes: ['name'],
              include: [{ model: App, attributes: ['name', 'miniPic'] }],
            },
          ],
        },
      ],
    });
    return purchases;
  }

  async getMySales(body: { userId: number }, queries: Record<string, string>) {
    const products = await Product.findAll({
      where: { userId: body.userId },
      attributes: ['id'],
    });
    const productIds = products.map((item) => item.id);

    const { _offset, _limit } = getWhereClause({ queries });

    const sales = await Purchase.findAll({
      where: { productId: productIds },
      attributes: ['id', 'status', 'sum', 'createdAt'],
      include: [
        {
          model: Product,
          attributes: ['id', 'name'],
          include: [
            {
              model: Category,
              attributes: ['name'],
              include: [{ model: App, attributes: ['name', 'miniPic'] }],
            },
          ],
        },
      ],
      offset: _offset,
      limit: _limit,
    });
    return sales;
  }

  async changePurchaseStatus(
    id: number,
    body: {
      userId: number;
      status: StatusType;
    },
  ) {
    try {
      const [count] = await Purchase.update(
        { status: body.status },
        {
          where: { id: id, userId: body.userId },
        },
      );

      if (!count) {
        throw new HttpException(
          'Ресурс не был обновлен',
          StatusCodes.UNAUTHORIZED,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      return { status: StatusCodes.OK, text: ReasonPhrases.OK };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
