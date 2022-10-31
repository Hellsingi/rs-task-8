import { DataSource } from 'typeorm';
import { DATABASE_CONNECTION, ConstantsRepository } from '../common/constants';
import { OrderEntity } from './entities/order.entity';

export const ordersProviders = [
  {
    provide: ConstantsRepository.ORDERS_REPOSITORY,
    useFactory: (connection: DataSource) =>
      connection.getRepository(OrderEntity),
    inject: [DATABASE_CONNECTION],
  },
];
