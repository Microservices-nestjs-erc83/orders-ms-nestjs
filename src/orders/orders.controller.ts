import { Controller, NotImplementedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationOrderDto } from './dto/pagination-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    console.log(createOrderDto)
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() paginationOrderDto: PaginationOrderDto ) {
    return this.ordersService.findAll( paginationOrderDto );
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id') id: string ) {
    return this.ordersService.findOne(id);
  }

}
