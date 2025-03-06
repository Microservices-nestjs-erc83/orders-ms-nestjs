import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrdersItemDto } from './dto/create-orders-item.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class OrdersItemsService extends PrismaClient implements OnModuleInit  {

  private readonly logger = new Logger('OrdersItemService')
  
    async onModuleInit() {
      await this.$connect()
      this.logger.log('Database ordersdb connected')
    }

  create(createOrdersItemDto: CreateOrdersItemDto) {
    //return 'This action adds a new ordersItem';
    return {
      serrvice: 'Orders Microservice',
      createOrderDto: createOrdersItemDto
    }

  }

  findAll() {
    return `This action returns all ordersItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordersItem`;
  }

}
