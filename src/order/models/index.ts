import { CartItem } from '../../cart/models';

export type OrderPayment = {
  type: string;
  address?: any;
  creditCard?: any;
};

export type OrderDelivery = {
  type: string;
  address: any;
};

export type Order = {
  id?: string;
  userId: string;
  cartId: string;
  items: CartItem[];
  payment: OrderPayment;
  delivery: OrderDelivery;
  comments: string;
  status: string;
  total: number;
};
