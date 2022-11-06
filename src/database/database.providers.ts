import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DATABASE_CONNECTION } from '../common/constants';
import { ConnectionDataSource } from './connection-options';

export const databaseProviders: Provider[] = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (): Promise<DataSource> => {
      return ConnectionDataSource;
    },
  },
];
