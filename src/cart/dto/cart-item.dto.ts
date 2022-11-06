import { IsString, IsNumber } from 'class-validator';

export class CartItemDto {
  @IsString()
  filmId: string;

  @IsNumber()
  count: number;
}
