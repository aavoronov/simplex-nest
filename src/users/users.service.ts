import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../mailer/mailer.service';
import { SendOneClickCredentialsDto } from './dto/send-one-click-creds.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { checkPhone, deleteFile, uploadFiles } from '../utils/functions';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInByPhoneDto } from './dto/sign-in-by-phone.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from './entities/user.entity';
// import fetch from 'node-fetch';
import { Op, Sequelize } from 'sequelize';
import { PhoneVerification } from '../phone-verifications/entities/phone-verification.entity';
import { Product } from '../products/entities/product.entity';
import { Review } from '../reviews/entities/review.entity';
import { Purchase } from '../purchases/entities/purchase.entity';
import { nanoid } from 'nanoid/non-secure';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly mailer: MailerService) {}

  private validPassword(password: string, userPassword: string) {
    return bcrypt.compareSync(password, userPassword);
  }

  async getUserByToken(token: string) {
    try {
      const result = await jwt.verify(token, process.env.JWT);

      // console.log(result);
      if (!!result.message) {
        throw new HttpException(
          'Сессия истекла или недействительна',
          StatusCodes.FORBIDDEN,
          {
            cause: new Error('Some Error'),
          },
        );
      }
      const user = await User.findOne({
        where: { login: result.login },
      });
      if (!user) {
        throw new HttpException(
          'Пользователь не существует',
          StatusCodes.UNAUTHORIZED,
          {
            cause: new Error('Some Error'),
          },
        );
      }
      return user;
    } catch (e) {
      throw new HttpException(e.message, StatusCodes.FORBIDDEN, {
        cause: new Error('Some Error'),
      });
    }
  }

  async oneClickSignUp(invite?: string) {
    const salt = bcrypt.genSaltSync();

    const generateLogin = () => {
      const randomLogin = Math.random().toString(36).slice(-8);
      const randomLoginCrypt = bcrypt.hashSync(randomLogin, salt).slice(-12);
      return randomLoginCrypt;
    };

    const checkAndCreateUser = async (login: string) => {
      const existingUser = await User.findOne({
        where: { login: login },
      });
      if (!!existingUser) {
        checkAndCreateUser(generateLogin());
      } else {
        const randomPassword = Math.random().toString(36).slice(-8);
        const randomPasswordCrypt = bcrypt.hashSync(randomPassword, salt);
        const newUser = await User.create({
          login: login,
          password: randomPasswordCrypt,
          inviteToken: nanoid(20),
          invitedBy: invite,
          name: login,
        });

        return {
          login: login,
          password: randomPassword,
        };
      }
    };

    const creds = await checkAndCreateUser(generateLogin());

    return creds;
  }

  async sendOneClickCredentials(body: SendOneClickCredentialsDto) {
    try {
      await this.mailer.sendOneClickCredentials(body);
      return { status: StatusCodes.OK, text: 'success' };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async signUpByEmail(user: CreateUserDto) {
    try {
      const { email, password, invite } = user;
      console.log(invite);

      if (!!(await User.findOne({ where: { login: email } }))) {
        throw new HttpException(
          'Пользователь с таким email уже существует',
          StatusCodes.CONFLICT,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      const salt = bcrypt.genSaltSync();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        login: email,
        password: passwordHash,
        inviteToken: nanoid(20),
        invitedBy: invite || null,
        name: email,
      });

      // if (newUser) {
      //   if (user.email) {
      //     await QuizReply.create({
      //       userId: newUser.id,
      //       occupation,
      //       position,
      //       anticipations,
      //     });
      //   }
      //   await this.createOrUpdateVerificationAndSend(newUser);
      // }

      const signInRes = await this.signIn({
        login: newUser.login,
        password: password,
      });

      return signInRes;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async signUpByPhone(body: { phone: string; invite?: string }) {
    const { phone, invite } = body;
    const phoneValid = checkPhone(phone);

    if (!phoneValid.correct) {
      throw new HttpException(
        'Некорректный номер телефона',
        StatusCodes.BAD_REQUEST,
      );
    }
    await User.create({
      login: phone,
      inviteToken: nanoid(20),
      invitedBy: invite,
      name: phone,
    });

    // return { email: newUser.email };
    return await this.createPhoneVerification({ phone: phone, invite: invite });
    // return await this.signIn({ login: phone, password: null });
  }

  async signIn(body: SignInDto) {
    const { login, password } = body;

    try {
      if (!login)
        throw new HttpException('Почта не введена', StatusCodes.BAD_REQUEST, {
          cause: new Error('Some Error'),
        });
      if (!password)
        throw new HttpException('Пароль не введен', StatusCodes.BAD_REQUEST, {
          cause: new Error('Some Error'),
        });

      // if (!checkEmail(login).correct)
      //   throw new HttpException(
      //     'Вы некорректно ввели адрес электронной почты',
      //     StatusCodes.BAD_REQUEST,
      //     {
      //       cause: new Error('Some Error'),
      //     },
      //   );

      const user = await User.findOne({
        where: { login },
      });

      let passwordMatches = false;

      if (user && user.isDeleted) {
        throw new HttpException('Аккаунт удален', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      if (user && user.isBlocked) {
        throw new HttpException('Аккаунт заблокирован', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      if (user) passwordMatches = this.validPassword(password, user.password);

      if (!user || !passwordMatches) {
        throw new HttpException(
          'Неправильный логин или пароль',
          StatusCodes.NOT_FOUND,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      // if (user.role === 'admin') {
      //   throw new HttpException(
      //     'Нет доступа к публичной части',
      //     StatusCodes.FORBIDDEN,
      //     {
      //       cause: new Error('Some Error'),
      //     },
      //   );
      // }

      const accessToken = jwt.sign(user.toJSON(), process.env.JWT, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return {
        status: StatusCodes.OK,
        message: ReasonPhrases.OK,
        token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          login: user.login,
          role: user.role,
          profilePic: user.profilePic,
          inviteToken: user.inviteToken,
          createdAt: user.createdAt,
        },
      };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async reauthorize(id: number) {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: { exclude: ['password'] },
      });

      const accessToken = jwt.sign(user.toJSON(), process.env.JWT, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return {
        status: StatusCodes.OK,
        message: ReasonPhrases.OK,
        token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          login: user.login,
          role: user.role,
          profilePic: user.profilePic,
          inviteToken: user.inviteToken,
          createdAt: user.createdAt,
        },
      };
    } catch (e) {
      throw new HttpException(e.message, StatusCodes.FORBIDDEN, {
        cause: new Error('Some Error'),
      });
    }
  }

  async createPhoneVerification(body: { phone: string; invite?: string }) {
    try {
      const { phone } = body;

      if (!phone)
        throw new HttpException('Телефон не введен', StatusCodes.BAD_REQUEST, {
          cause: new Error('Some Error'),
        });

      if (!checkPhone(phone).correct)
        throw new HttpException(
          'Некорректный формат номера телефона',
          StatusCodes.BAD_REQUEST,
          {
            cause: new Error('Some Error'),
          },
        );

      const phoneSanitized = checkPhone(phone).result;

      let user = await User.findOne({
        where: { login: phone },
      });

      if (!user) {
        user = await User.create({
          login: phone,
          password: null,
          inviteToken: nanoid(20),
          invitedBy: body.invite,
          name: phone,
        });
        // console.log('created');
      }

      if (user && user.isDeleted) {
        throw new HttpException('Аккаунт удален', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      if (user && user.isBlocked) {
        throw new HttpException('Аккаунт заблокирован', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      await PhoneVerification.destroy({ where: { userId: user.id } });

      const otp = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');

      console.log('otp', otp);

      const verification = await PhoneVerification.create({
        userId: user.id,
        otp: otp,
      });

      const smsaeroEmail = process.env.SMSAERO_EMAIL;
      const smsaeroToken = process.env.SMSAERO_TOKEN;

      const authorization = Buffer.from(
        `${smsaeroEmail}:${smsaeroToken}`,
      ).toString('base64');

      const fetchData = async () =>
        await globalThis.fetch(
          `https://gate.smsaero.ru/v2/auth`,
          // `https://gate.smsaero.ru/v2/sms/send?number=${phoneSanitized}&text=SimpleX+-+код+авторизации+${verification.otp}&sign=SMS Aero`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${authorization}`,
            },
          },
        );

      const status = (await fetchData()).status;

      console.log('status', status);

      if (status !== 200) {
        throw new HttpException('Ошибка SMS-сервиса', StatusCodes.BAD_GATEWAY, {
          cause: new Error('Some Error'),
        });
      }

      return { otp: verification.otp };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async signInByPhone(body: SignInByPhoneDto) {
    const { phone, otp } = body;

    try {
      if (otp.length < 4) {
        throw new HttpException('Введите код доступа', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      const user = await User.findOne({
        where: { login: phone },
        attributes: ['id', 'login', 'role', 'isDeleted', 'isBlocked'],
      });

      if (user && user.isDeleted) {
        throw new HttpException('Аккаунт удален', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      if (user && user.isBlocked) {
        throw new HttpException('Аккаунт заблокирован', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      const verification = await PhoneVerification.findOne({
        where: {
          userId: user.id,
          createdAt: { [Op.gt]: new Date(Date.now() - 5 * 60 * 1000) },
          //5 minutes otp lifetime
        },
      });

      if (!verification) {
        throw new HttpException(
          'Код доступа истек. Запросите новый',
          StatusCodes.FORBIDDEN,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      // // console.log('otp', verification.otp);

      if (otp && otp !== verification.otp) {
        throw new HttpException('Неверный код доступа', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      const accessToken = jwt.sign(user.toJSON(), process.env.JWT, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return {
        status: StatusCodes.OK,
        message: ReasonPhrases.OK,
        token: accessToken,
        user: { role: user.role },
      };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async signUp(user: CreateUserDto) {
    try {
      const { email, password } = user;

      const salt = bcrypt.genSaltSync();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        login: email,
        password: passwordHash,
        inviteToken: nanoid(20),
      });

      const signInRes = await this.signIn({
        login: newUser.login,
        password: password,
      });

      return signInRes;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async getAProfile(id: number) {
    const salesLiteral =
      Sequelize.literal(`(SELECT COUNT("products->purchases"."id") AS "salesCount" 
      FROM "Users" AS "User" 
      INNER JOIN "Products" AS "products" ON "User"."id" = "products"."userId" AND "products"."status" IN ('active', 'sold') 
      LEFT OUTER JOIN "Purchases" AS "products->purchases" ON "products"."id" = "products->purchases"."productId"
      WHERE "User"."id" = 1 
      GROUP BY "User"."id")`);

    const user = await User.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'isBlocked',
        'createdAt',
        'profilePic',
        // [avgLiteral, 'average'],
        [salesLiteral, 'salesCount'],
        [
          Sequelize.fn('AVG', Sequelize.col('products.reviews.rating')),
          'average',
        ],
        [
          Sequelize.fn('COUNT', Sequelize.col('products.reviews.rating')),
          'count',
        ],
      ],
      include: {
        model: Product,
        attributes: [],
        where: { status: ['active', 'sold'] },
        include: [{ model: Review, attributes: [] }],
      },

      group: ['User.id'],
    });

    return user;
  }

  async editUser(
    body: UpdateUserDto,
    token: string,
    file?: Express.Multer.File,
  ) {
    const { name } = body;

    const user = await this.getUserByToken(token);
    interface UpdateData {
      name: string;
      profilePic: string;
    }
    const updateData: Partial<UpdateData> = {};

    if (!!name) {
      updateData.name = name;
    }
    if (!!file) {
      const filenames = await uploadFiles(file, '/users');
      if (user.profilePic) {
        await deleteFile(user.profilePic, 'users');
      }
      updateData.profilePic = filenames[0];
    }

    await user.update(updateData);
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
