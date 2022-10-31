import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { CartItemEntity } from './cart-item.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { OrderEntity } from '../../order/entities/order.entity';

@Entity('Carts')
export class CartEntity {
  @PrimaryColumn('uuid')
  id: string;

  @OneToMany(() => CartItemEntity, (items) => items.cart, { cascade: true })
  items: CartItemEntity[];

  @OneToOne(() => UserEntity, (user) => user.cart)
  user: UserEntity;

  @OneToMany(() => OrderEntity, (orders) => orders.cart)
  orders: OrderEntity[];

  @CreateDateColumn({ name: 'createdAt', type: Date, nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: Date, nullable: false })
  updatedAt: Date;
}
