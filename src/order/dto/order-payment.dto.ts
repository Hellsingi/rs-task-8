import { IsString, IsEnum, IsOptional } from 'class-validator';

export class OrderPaymentDto {
  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  creditCard?: string;
}
