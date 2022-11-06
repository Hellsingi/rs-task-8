import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity('CartItems')
export class CartItemEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => CartEntity, { nullable: false })
  @JoinColumn({ name: 'cartId' })
  cart: CartEntity;

  @Column({ name: 'filmId' })
  filmId: string;

  @Column({ name: 'count' })
  count: number;
}
