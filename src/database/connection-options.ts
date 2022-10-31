import { DataSource } from 'typeorm';
import { StockEntity } from '../stock/entities/stock.entity';
import { FilmEntity } from '../film/entities/film.entity';
import dotenv from 'dotenv';

dotenv.config();

export const ConnectionDataSource: DataSource = new DataSource({
  name: `default`,
  type: `postgres`,
  port: Number(process.env.DB_PORT),
  synchronize: false,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  entities: [FilmEntity, StockEntity],
  migrations: ['src/migrations/*.ts'],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
