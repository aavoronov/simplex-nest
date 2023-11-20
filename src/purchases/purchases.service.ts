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
import { User } from '../users/entities/user.entity';
import { Review } from '../reviews/entities/review.entity';

@Injectable()
export class PurchasesService {
  private async firstPurchase(userId: number) {
    const user = await User.findOne({ where: { id: userId } });
    console.log(user.invitedBy);
    if (!user.invitedBy) return;

    const invitedBy = await User.findOne({
      where: { inviteToken: user.invitedBy },
    });
    await user.update({ invitedBy: null });
    console.log('first purchase, invited by ' + invitedBy.login);
  }

  private async createChatIfNoneExist(userIds: [number, number]) {
    const ids = userIds.sort((a, b) => a - b);
    const chatName = ids[0] + '-' + ids[1];

    const existingChat = await ChatRoom.findOne({ where: { name: chatName } });

    if (!existingChat) {
      const chat = await ChatRoom.create({ name: chatName });
      await Promise.all(
        ids.map((item) => RoomAccess.create({ roomId: chat.id, userId: item })),
      );
    }
  }

  private async deleteChatOnPurchaseCompletion(userIds: [number, number]) {
    const ids = userIds.sort((a, b) => a - b);
    const chatName = ids[0] + '-' + ids[1];

    const room = await ChatRoom.findOne({ where: { name: chatName } });
    await RoomAccess.destroy({ where: { roomId: room.id } });
    await room.destroy();
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
      sum: product.price,
      userId: userId,
    });

    await this.createChatIfNoneExist([userId, product.userId]);
    await this.firstPurchase(userId);

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
            {
              model: Review,
              where: { userId: body.userId },
              required: false,
              attributes: ['id'],
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
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
      order: [['id', 'DESC']],
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
      console.log(id, body.userId);
      // const [count] = await Purchase.update(
      //   { status: body.status },
      //   {
      //     where: { id: id, userId: body.userId },
      //   },
      // );

      const purchase = await Purchase.findOne({
        attributes: ['id', 'userId'],
        where: { id: id, userId: body.userId },
        include: [
          {
            model: Product,
            attributes: ['id'],
            include: [{ model: User, attributes: ['id'] }],
          },
        ],
      });

      if (purchase.status === 'completed')
        return { status: StatusCodes.FORBIDDEN, text: ReasonPhrases.FORBIDDEN };

      // if (body.status === 'completed') {
      //   await this.deleteChatOnPurchaseCompletion([
      //     purchase.userId,
      //     purchase.product.user.id,
      //   ]);
      // }
      await purchase.update({ status: body.status });

      return { status: StatusCodes.OK, text: ReasonPhrases.OK };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }
}
