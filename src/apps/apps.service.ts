import { Injectable } from '@nestjs/common';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { App } from './entities/app.entity';
import { Constraint } from '../constraints/entities/constraint.entity';
import { Category } from '../categories/entities/category.entity';
import { getWhereClause } from '../utils/functions';
import { Op } from 'sequelize';

@Injectable()
export class AppsService {
  create(createAppDto: CreateAppDto) {
    return 'This action adds a new app';
  }

  async getAllApps(page: number, type?: 'apps' | 'games', search?: string) {
    const limit = 24;
    const offset = page * limit - limit;

    // const whereClause: {
    //   isGame?: boolean;
    //   name?: { [Op.iLike]: string };
    // } = {};

    const initial: { isGame?: boolean } = {};
    if (!!type) initial.isGame = type === 'apps' ? false : true;

    console.log({ search, page: !!page ? page.toString() : '1' });
    console.log(initial);
    const { whereClause, _offset, _limit } = getWhereClause({
      queries: { search, page: !!page ? page.toString() : '1' },
      initial: initial,
      searchFields: ['name'],
    });

    console.log(whereClause);

    // if (!!type) whereClause.isGame = type === 'apps' ? false : true;
    // if (!!search) whereClause.name = { [Op.iLike]: `%${search}%` };

    const { rows, count } = await App.findAndCountAll({
      where: whereClause,
      offset: _offset,
      limit: _limit,
    });
    return { rows, count };
  }

  async getOneApp(id: number) {
    const app = await App.findOne({
      where: { id },
      include: [{ model: Category, include: [{ model: Constraint }] }],
    });
    return app;
  }

  update(id: number, updateAppDto: UpdateAppDto) {
    return `This action updates a #${id} app`;
  }

  remove(id: number) {
    return `This action removes a #${id} app`;
  }
}
