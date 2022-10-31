import { DataSource } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CartEntity } from './entities/cart.entity';
import { ConstantsRepository, DATABASE_CONNECTION } from '../common/constants';
import { FilmEntity } from 'src/film/entities/film.entity';

export const cartsProviders = [
  {
    provide: ConstantsRepository.CARTS_REPOSITORY,
    useFactory: (connection: DataSource) =>
      connection.getRepository(CartEntity),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: ConstantsRepository.USERS_REPOSITORY,
    useFactory: (connection: DataSource) =>
      connection.getRepository(UserEntity),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: ConstantsRepository.FILMS_REPOSITORY,
    useFactory: (connection: DataSource) =>
      connection.getRepository(FilmEntity),
    inject: [DATABASE_CONNECTION],
  },
];
