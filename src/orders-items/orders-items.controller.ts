import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersItemsService } from './orders-items.service';
import { CreateOrdersItemDto } from './dto/create-orders-item.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderItemStatusDto } from './dto';

@Controller()
export class OrdersItemsController {
  constructor(private readonly ordersItemsService: OrdersItemsService) {}

  @MessagePattern('createOrdersItem')
  create(@Payload() createOrdersItemDto: CreateOrdersItemDto) {
    return this.ordersItemsService.create(createOrdersItemDto);
  }


  @MessagePattern('findAllOrdersItems')
  findAll(@Payload() orderPaginationDto: OrderPaginationDto ) {
    return this.ordersItemsService.findAll( orderPaginationDto );
  }

  @MessagePattern('findOneOrderItem')
  findOne(@Payload('id') id: string) {
    return this.ordersItemsService.findOne(id);
  }

  @MessagePattern('changeOrderItemStatus')
  changeOrderStatus(
    @Payload() changeOrderItemStatusDto: ChangeOrderItemStatusDto
  ){
    return this.ordersItemsService.changeStatus( changeOrderItemStatusDto )
  }


}
