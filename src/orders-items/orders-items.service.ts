import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrdersItemDto } from './dto/create-orders-item.dto';
import { PrismaClient } from '@prisma/client';
import { PRODUCT_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
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
      try {
        //1 Confirma los ids de los productos
        const productsIds = createOrdersItemDto.items.map( item => item.productId )
        const products: any[] = await firstValueFrom(
          this.productsClient.send({ cmd: 'validate_products'}, productsIds),
        );

        //2 calculos de los valores
        const totalAmount = createOrdersItemDto.items.reduce(( acc, orderItem ) => {
          
          const price = products.find( 
            (product) => product.id === orderItem.productId, 
          ).price 
          return price * orderItem.quantity;
        }, 0);
        //return {totalAmount}
      
        const totalItems = createOrdersItemDto.items.reduce( (acc, orderItem) => {
          return acc + orderItem.quantity; 
        }, 0)

        //3. Crear transaccion base de datos
        const orderItem = await this.order.create({
          data: {
            totalAmount: totalAmount,
            totalItems: totalItems,

            Order_item: {
              createMany: {
                data: createOrdersItemDto.items.map(( orderItem ) => ({
                  price: products.find( product => product.id === orderItem.productId ).price ,
                  productId: orderItem.productId,
                  quantity: orderItem.quantity
                }))
              } 
            }       
          }
        }) 
        return orderItem;
      
      } catch (error) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Error al crear una OrdenItem'
        })
    }

  }

  findAll() {
    return `This action returns all ordersItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordersItem`;
  }

}
