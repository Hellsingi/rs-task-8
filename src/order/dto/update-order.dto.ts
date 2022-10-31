import {
  ValidateNested,
  IsEnum,
  IsArray,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDeliveryDto } from './order-delivery.dto';
import { OrderPaymentDto } from './order-payment.dto';
import { CartItemEntity } from '../../cart/entities/cart-item.entity';

export class UpdateOrderDto {
  @IsArray()
  items: CartItemEntity[];

  @IsNumber()
  total: number;

  @ValidateNested()
  @Type(() => OrderPaymentDto)
  payment: OrderPaymentDto;

  @ValidateNested()
  @Type(() => OrderDeliveryDto)
  delivery: OrderDeliveryDto;

  @IsOptional()
  @IsString()
  comments: string;

  @IsString()
  status: string;
}
