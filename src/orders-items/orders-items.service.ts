import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrdersItemDto } from './dto/create-orders-item.dto';
import { PrismaClient } from '@prisma/client';
import { PRODUCT_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationOrderDto } from 'src/orders/dto/pagination-order.dto';

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
          },
          include: {
            Order_item: {
              select: {
                price: true,
                quantity: true,
                productId: true,
              }
            }
          }
        }) 
        return {
          ...orderItem,
          Order_item: orderItem.Order_item.map(( orderItem ) => ({
            ...orderItem,
            name: products.find( product => product.id === orderItem.productId ).name
          }))
        };
      
      } catch (error) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Error al crear una OrdenItem'
        })
    }

  }

  async findOne(id: string) {

    const order = await this.order.findFirst({
      where: { id },
      include: {
        Order_item: {
          select: {
            price: true,
            quantity: true,
            productId: true
          }
        }
      }
    })

    if( !order ) {
      throw new RpcException({
        message: `Order with id #${ id } not found`,
        status: HttpStatus.BAD_REQUEST,
      })
    }

    const productIds = order.Order_item.map(( orderItem ) => orderItem.productId )
    const products: any[] = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_products' }, productIds),
    )


    return {
      ...order,
      Order_item: order.Order_item.map( orderItem => ({
        ...orderItem,
        name: products.find( (product) => product.id === orderItem.productId ).name,
      }))
    }
  }


  async findAll( paginationOrderDto: PaginationOrderDto) {
  
      const totalPages = await this.order.count({
        where: {
          status: paginationOrderDto.status
        }
      })
  
      const currentPage = paginationOrderDto.page;
      const perPage = paginationOrderDto.limit;
  
      return {
        data: await this.order.findMany({
          skip: (currentPage - 1 ) * perPage,
          take: perPage,
          where: {
            status: paginationOrderDto.status
          }
        }),
        meta: {
          total: totalPages,
          page: currentPage,
          lastPage: Math.ceil( totalPages / perPage )
        }
      }
    }



}
