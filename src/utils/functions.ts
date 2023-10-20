import { Op } from 'sequelize';

const reg = /.+@.+\.[A-Za-z]+$/;
const numbers = /[0-9]/g;

interface ICheckResult {
  correct: boolean;
  error?: string;
  result?: string;
}

export const checkEmail = (value: string): ICheckResult => {
  if (!value.match(reg))
    return { correct: false, error: 'You have entered an invalid email' };
  return { correct: true, result: value };
};
export const checkPhone = (value: string): ICheckResult => {
  // console.log('value', value);
  if (value.match(numbers).length < 11)
    return {
      correct: false,
      error: 'Минимальная длина телефона - 11 символов',
    };
  return { correct: true, result: value.match(numbers).join('') };
};
export const maskPhone = (phone: string): string => {
  const clearPhone = phone.replace(/[\[\]{}+()-]|\s/gm, '');
  if (clearPhone.length === 11) {
    const numberSplice = clearPhone
      .replace(/\D/g, '')
      .match(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/);
    return `+${numberSplice[1]} (${numberSplice[2]}) ${numberSplice[3]}-${numberSplice[4]}-${numberSplice[5]}`;
  }
  if (clearPhone.length === 12) {
    const numberSplice = clearPhone
      .replace(/\D/g, '')
      .match(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/);
    return `+${numberSplice[1]} (${numberSplice[2]}) ${numberSplice[3]}-${numberSplice[4]}-${numberSplice[5]}`;
  }
  if (clearPhone.length === 13) {
    const numberSplice = clearPhone
      .replace(/\D/g, '')
      .match(/(\d{3})(\d{3})(\d{3})(\d{2})(\d{2})/);
    return `+${numberSplice[1]} (${numberSplice[2]}) ${numberSplice[3]}-${numberSplice[4]}-${numberSplice[5]}`;
  }
  if (clearPhone.length === 14) {
    const numberSplice = clearPhone
      .replace(/\D/g, '')
      .match(/(\d{4})(\d{3})(\d{3})(\d{2})(\d{2})/);
    return `+${numberSplice[1]} (${numberSplice[2]}) ${numberSplice[3]}-${numberSplice[4]}-${numberSplice[5]}`;
  }
};

interface WhereClauseParams {
  initial?: Record<string, any>;
  queries: Record<string, string>;
  limit?: number;
  searchFields?: string | string[];
}

export const getWhereClause = (params: WhereClauseParams) => {
  const { initial, queries, searchFields } = params;
  const whereClause = { ...initial };
  const rawQueries = { ...queries };

  let page = 1;
  let limit: number = params.limit || 20;
  let order;

  if (Object.keys(rawQueries).includes('page')) {
    page = +rawQueries.page;
    delete rawQueries.page;
  }

  if (Object.keys(rawQueries).includes('limit')) {
    limit = +rawQueries.limit;
    delete rawQueries.limit;
  }

  if (
    Object.keys(rawQueries).includes('search') &&
    (searchFields || searchFields.length)
  ) {
    if (typeof searchFields === 'string') {
      whereClause[searchFields] = { [Op.iLike]: `%${rawQueries.search}%` };
    } else {
      const or = [];
      searchFields.forEach((field) =>
        or.push({ [field]: { [Op.iLike]: `%${rawQueries.search}%` } }),
      );
      whereClause[Op.or as any] = or;
    }
    delete rawQueries.search;
  }
  if (!rawQueries.search) {
    delete rawQueries.search;
  }

  // if (
  //   Object.keys(rawQueries).includes('sort') ||
  //   Object.keys(rawQueries).includes('order')
  // ) {
  //   const orderParam = rawQueries.sort || rawQueries.order;

  //   // orderParam
  //   order = +rawQueries.sort;
  //   delete rawQueries.sort;
  //   delete rawQueries.order;
  // }

  Object.entries(rawQueries).forEach((entry: [string, string]) => {
    if (entry[1] === 'null') return;
    if (entry[1].includes(',')) {
      return (whereClause[entry[0]] = { [Op.in]: entry[1].split(',') });
    }
    if (entry[1].includes('-')) {
      const [from, to] = entry[1].split('-');
      if (from === 'null' && to === 'null') return;
      if (from === 'null') {
        return (whereClause[entry[0]] = { [Op.lt]: +to });
      }
      if (to === 'null') {
        return (whereClause[entry[0]] = { [Op.gt]: +from });
      }
      return (whereClause[entry[0]] = { [Op.between]: entry[1].split('-') });
    }
    return (whereClause[entry[0]] = entry[1]);
  });

  let offset = 0;
  if (page && limit) {
    offset = page * limit - limit;
  }

  return { whereClause, _limit: limit, _offset: offset };
};
