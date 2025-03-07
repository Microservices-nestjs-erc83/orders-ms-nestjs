import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersItemsService } from './orders-items.service';
import { CreateOrdersItemDto } from './dto/create-orders-item.dto';

@Controller()
export class OrdersItemsController {
  constructor(private readonly ordersItemsService: OrdersItemsService) {}

  @MessagePattern('createOrdersItem')
  create(@Payload() createOrdersItemDto: CreateOrdersItemDto) {
    return this.ordersItemsService.create(createOrdersItemDto);
  }

  @MessagePattern('findAllOrdersItems')
  findAll() {
    return this.ordersItemsService.findAll();
  }

  @MessagePattern('findOneOrderItem')
  findOne(@Payload('id') id: string) {
    return this.ordersItemsService.findOne(id);
  }

}
