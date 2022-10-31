import { IsString } from 'class-validator';

export class OrderDeliveryDto {
  @IsString()
  type: string;

  @IsString()
  address: string;
}
