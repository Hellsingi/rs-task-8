import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { Repository, getConnection } from 'typeorm';
import { calculateCartTotal } from '../models-rules';
import { v4 } from 'uuid';
import { EntityManager } from 'typeorm';

import { ConstantsRepository, CustomResponse } from '../../common/constants';

import { UpdateCartDto } from '../dto/update-cart.dto';
import { AdditionalOrderInfoDto } from '../../order/dto/additional-order-info.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { CartEntity } from '../entities/cart.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { createResponse } from '../../common/create-response';
import { isEntityExist } from '../../common/validation';
import { OrderService } from '../../order';
import { FilmEntity } from '../../film/entities/film.entity';

@Injectable()
export class CartService {
  constructor(
    @Inject(ConstantsRepository.CARTS_REPOSITORY)
    private readonly cartRepository: Repository<CartEntity>,
    @Inject(ConstantsRepository.USERS_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(ConstantsRepository.FILMS_REPOSITORY)
    private readonly filmRepository: Repository<FilmEntity>,
    private readonly orderService: OrderService,
  ) {}

  async findByUserId(userId: string): Promise<CartEntity | null> {
    return this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'items')
      .leftJoin('cart.user', 'user')
      .where('user.id = :userId', {
        userId: '85ca217f-9f30-470f-b444-6ab03c37adc5',
      })
      .getOne();
  }

  async createByUserId(userId: string): Promise<CartEntity | CustomResponse> {
    const user = isEntityExist(
      await this.userRepository.findOne({
        where: {
          id: '85ca217f-9f30-470f-b444-6ab03c37adc5',
        },
      }),
      'User',
    );

    if (!(user instanceof UserEntity)) {
      return user;
    }

    const creationDate = new Date();

    const id = v4();
    await this.cartRepository.save({
      id,
      user,
      createdAt: creationDate,
      updatedAt: creationDate,
    });

    return this.cartRepository.findOne({
      where: {
        id,
      },
    });
  }

  async prepareFullCartItemsInfoAndCalculateTotalPrice(userCart: CartEntity) {
    const userCartItemsWithFilmInfo = [];

    if (userCart.items && userCart.items.length) {
      for await (const item of userCart.items) {
        const film = await this.filmRepository.findOne({
          where: {
            id: item.filmId,
          },
        });
        userCartItemsWithFilmInfo.push({ ...item, film });
      }
    }

    return calculateCartTotal(userCartItemsWithFilmInfo);
  }

  async findOrCreateByUserId(userId: string): Promise<
    | (CustomResponse & {
        body: {
          cart: CartEntity;
          total: number;
        };
      })
    | CustomResponse
  > {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      const totalCartItemPrice =
        await this.prepareFullCartItemsInfoAndCalculateTotalPrice(userCart);

      return createResponse(HttpStatus.OK, 'OK', {
        cart: userCart,
        total: totalCartItemPrice,
      });
    }

    const createdCart = await this.createByUserId(userId);

    if (createdCart instanceof CartEntity) {
      const totalCartItemPrice =
        await this.prepareFullCartItemsInfoAndCalculateTotalPrice(createdCart);

      return createResponse(HttpStatus.CREATED, 'Cart has been created', {
        cart: createdCart,
        total: totalCartItemPrice,
      });
    } else {
      return createdCart;
    }
  }

  async checkFilmCount(
    filmId: string,
    itemCount: number,
  ): Promise<CustomResponse | void> {
    const film = isEntityExist(
      await this.filmRepository.findOne({
        where: {
          id: filmId,
        },
        relations: ['stock'],
      }),
      'Film',
    );

    if (!(film instanceof FilmEntity)) {
      return film;
    }

    if (film.stock.count < itemCount) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: `You can't buy '${film.title}' books more than ${film.stock.count}`,
      };
    }
  }

  async updateByUserId(userId: string, updateCartDto: UpdateCartDto) {
    const getCartResponse = (await this.findOrCreateByUserId(
      userId,
    )) as CustomResponse & { body: { cart: CartEntity; total: number } };

    if (!getCartResponse.body) {
      return getCartResponse;
    }

    const { cart } = getCartResponse.body;

    for await (const item of updateCartDto.items) {
      const checkResponse = await this.checkFilmCount(item.filmId, item.count);

      if (checkResponse) {
        return checkResponse;
      }
    }

    const newItems = updateCartDto.items.map((item) => ({
      ...item,
      id: v4(),
      cart,
    }));

    await getConnection().transaction(async (manager) => {
      await manager.getRepository(CartItemEntity).save(newItems);

      await manager
        .getRepository(CartEntity)
        .update(cart.id, { updatedAt: new Date() });
    });

    const updatedCart = await this.cartRepository.findOne({
      where: {
        id: cart.id,
      },
      relations: ['items'],
    });

    const totalCartItemPrice =
      await this.prepareFullCartItemsInfoAndCalculateTotalPrice(updatedCart);

    return createResponse(HttpStatus.OK, 'OK', {
      cart: totalCartItemPrice,
      total: totalCartItemPrice,
    });
  }

  async remove(
    manager: EntityManager,
    userId: string,
  ): Promise<CustomResponse> {
    const user = await manager.getRepository(UserEntity).findOne({
      where: {
        id: '85ca217f-9f30-470f-b444-6ab03c37adc5',
      },
      relations: ['cart', 'cart.items'],
    });

    if (user.cart.items.length) {
      const cartItemIds = user.cart.items.map((item) => item.id);

      await manager.getRepository(CartItemEntity).delete(cartItemIds);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  async removeByUserId(
    userId: string,
    manager?: EntityManager,
  ): Promise<CustomResponse> {
    if (manager) {
      return this.remove(manager, userId);
    } else {
      return getConnection().transaction(async (manager) => {
        return this.remove(manager, userId);
      });
    }
  }

  async checkout(
    userId: string,
    additionalOrderInfoDto: AdditionalOrderInfoDto,
  ): Promise<
    | (CustomResponse & {
        body: OrderEntity;
      })
    | CustomResponse
  > {
    const cart = await this.findByUserId(userId);

    if (!(cart || cart.items.length)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Cart is empty',
      };
    }

    const total = await this.prepareFullCartItemsInfoAndCalculateTotalPrice(
      cart,
    );

    return getConnection().transaction(async (manager: EntityManager) => {
      const order = await this.orderService.createOne(manager, {
        ...additionalOrderInfoDto,
        items: cart.items,
        userId,
        total,
      });

      await this.removeByUserId(userId);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order },
      };
    });
  }
}
