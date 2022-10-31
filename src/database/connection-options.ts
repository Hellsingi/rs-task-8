import { DataSource } from 'typeorm';
import { StockEntity } from '../stock/entities/stock.entity';
import { FilmEntity } from '../film/entities/film.entity';
import { CartItemEntity } from '../cart/entities/cart-item.entity';
import { CartEntity } from '../cart/entities/cart.entity';
import { UserEntity } from '../users/entities/user.entity';
import { OrderEntity } from '../order/entities/order.entity';

import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_NAME, DB_PASSWORD } = process.env;

export const ConnectionDataSource: DataSource = new DataSource({
  type: `postgres`,
  port: Number(DB_PORT),
  host: DB_HOST,
  username: DB_USERNAME,
  database: DB_NAME,
  password: DB_PASSWORD,
  entities: [
    CartEntity,
    CartItemEntity,
    UserEntity,
    FilmEntity,
    StockEntity,
    OrderEntity,
  ],
  logging: true,
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
