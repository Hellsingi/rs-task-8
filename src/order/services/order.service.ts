import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { v4 } from 'uuid';
import { EntityManager, Repository } from 'typeorm';
import { CustomResponse, ConstantsRepository } from '../../common/constants';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderEntity } from '../entities/order.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { isEntityExist } from '../../common/validation';
import { createResponse } from '../../common/create-response';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ConstantsRepository.ORDERS_REPOSITORY)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async findOneById(orderId: string): Promise<
    | (CustomResponse & {
        body: OrderEntity;
      })
    | CustomResponse
  > {
    const order = isEntityExist(
      await this.orderRepository.findOne({
        where: {
          id: orderId,
        },
      }),
      'Order',
    );

    if (!(order instanceof OrderEntity)) {
      return order;
    }

    return createResponse(HttpStatus.OK, 'OK', order);
  }

  public async createOne(
    manager: EntityManager,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderEntity> {
    const user = await manager.getRepository(UserEntity).findOne({
      where: {
        id: '85ca217f-9f30-470f-b444-6ab03c37adc5',
      },
      relations: ['cart'],
    });

    const createdOrder = await manager.getRepository(OrderEntity).save({
      id: v4(),
      user,
      cart: user.cart,
      payment: createOrderDto.payment || null,
      delivery: createOrderDto.delivery || null,
      items: createOrderDto.items,
      comments: createOrderDto.comments || null,
      status: 'in progress',
      total: createOrderDto.total,
    });

    const order = await manager.getRepository(OrderEntity).findOne({
      where: {
        id: createdOrder.id,
      },
    });

    return order;
  }

  async updateOne(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<
    | (CustomResponse & {
        body: OrderEntity;
      })
    | CustomResponse
  > {
    const findOrderInDBResponse = (await this.findOneById(
      orderId,
    )) as CustomResponse & { body: OrderEntity };

    if (!findOrderInDBResponse.body) {
      return findOrderInDBResponse;
    }

    const order = findOrderInDBResponse.body;
    await this.orderRepository.save({
      id: order.id,
      payment: updateOrderDto.payment,
      delivery: updateOrderDto.delivery,
      items: updateOrderDto.items,
      comments: updateOrderDto.comments || null,
      status: updateOrderDto.status,
      total: updateOrderDto.total,
    });

    const updatedOrder = await this.orderRepository.findOne({
      where: {
        id: order.id,
      },
    });

    return createResponse(HttpStatus.OK, 'OK', updatedOrder);
  }
}
