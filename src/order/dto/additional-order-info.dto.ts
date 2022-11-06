import { ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { OrderDeliveryDto } from './order-delivery.dto';
import { OrderPaymentDto } from './order-payment.dto';

export class AdditionalOrderInfoDto {
  @ValidateNested()
  @Type(() => OrderPaymentDto)
  payment: OrderPaymentDto;

  @ValidateNested()
  @Type(() => OrderDeliveryDto)
  delivery: OrderDeliveryDto;

  @IsOptional()
  @IsString()
  comments: string;
}
