import { HttpStatus } from '@nestjs/common';

export const ConstantsRepository = {
  USERS_REPOSITORY: 'USERS_REPOSITORY',
  CARTS_REPOSITORY: 'CARTS_REPOSITORY',
  CART_ITEMS_REPOSITORY: 'CART_ITEMS_REPOSITORY',
  ORDERS_REPOSITORY: 'ORDERS_REPOSITORY',
  FILMS_REPOSITORY: 'FILMS_REPOSITORY',
};

export type CustomResponse = {
  statusCode: HttpStatus;
  message: string;
};

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const JWT_CONFIG = {
  secret: 'secret',
  expiresIn: '12h',
};
