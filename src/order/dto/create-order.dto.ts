import {
  ValidateNested,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

import { OrderPaymentDto } from './order-payment.dto';
import { OrderDeliveryDto } from './order-delivery.dto';
import { CartItemEntity } from '../../cart/entities/cart-item.entity';

export class CreateOrderDto {
  @IsArray()
  items: CartItemEntity[];

  @IsNumber()
  total: number;

  @IsString()
  userId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderPaymentDto)
  payment: OrderPaymentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderDeliveryDto)
  delivery: OrderDeliveryDto;

  @IsOptional()
  @IsString()
  comments: string;
}
