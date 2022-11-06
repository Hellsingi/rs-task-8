import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';
import { DatabaseModule } from '../database/database.module';

import { CartController } from './cart.controller';
import { cartsProviders } from './cart.providers';
import { CartService } from './services';

@Module({
  imports: [DatabaseModule, OrderModule],
  providers: [CartService, ...cartsProviders],
  controllers: [CartController],
})
export class CartModule {}
