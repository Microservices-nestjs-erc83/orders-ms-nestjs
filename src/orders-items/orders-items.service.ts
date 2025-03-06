import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrdersItemDto } from './dto/create-orders-item.dto';
import { PrismaClient } from '@prisma/client';
import { PRODUCT_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersItemsService extends PrismaClient implements OnModuleInit  {

  private readonly logger = new Logger('OrdersItemService')
  
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {
    super()
  }
  
  
    async onModuleInit() {
      await this.$connect()
      this.logger.log('Database ordersdb connected')
    }

  async create(createOrdersItemDto: CreateOrdersItemDto) {
    
    const ids = [7,8];

    //observable a promesa con firstValueForm
    const products = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_products'}, ids)
    )
    
    return products;


    //return {
    //  serrvice: 'Orders Microservice',
    //  createOrderDto: createOrdersItemDto
    //}

  }

  findAll() {
    return `This action returns all ordersItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordersItem`;
  }

}
