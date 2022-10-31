import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ordersProviders } from './order.providers';
import { OrderService } from './services';
@Module({
  imports: [DatabaseModule],
  providers: [OrderService, ...ordersProviders],
  exports: [OrderService],
})
export class OrderModule {}
