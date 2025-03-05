import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { PaginationOrderDto } from './dto/pagination-order.dto';
import { ChangeOrderStatusDto } from './dto';


@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService')

  async onModuleInit() {
    await this.$connect()
    this.logger.log('Database ordersdb connected')
  }

  
  create(createOrderDto: CreateOrderDto) {
    return this.order.create({
      data: createOrderDto
    })
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

  async findOne(id: string) {

    const order = await this.order.findFirst({
      where: { id: id }
    })

    if( !order ) {
      throw new RpcException({
        message: `Order with id #${ id } not found`,
        status: HttpStatus.BAD_REQUEST,
      })
    }

    return order
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto ) {

    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne( id )          // deberia de existir



    return this.order.update({
      where: { id },
      data: {
        status: status 
      }
    })

  }

}
