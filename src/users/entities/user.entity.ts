import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CartEntity } from '../../cart/entities/cart.entity';
import { OrderEntity } from '../../order/entities/order.entity';

@Entity('Users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ name: 'password', nullable: true })
  password: string;

  @OneToOne(() => CartEntity, (cart) => cart.user, { nullable: true })
  @JoinColumn({ name: 'cartId' })
  cart: CartEntity;

  @OneToMany(() => OrderEntity, (orders) => orders.user, { cascade: true })
  orders: OrderEntity[];
}
