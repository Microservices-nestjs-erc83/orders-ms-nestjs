import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersItemsService } from './orders-items.service';
import { CreateOrdersItemDto } from './dto/create-orders-item.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderItemStatusDto } from './dto';

@Controller()
export class OrdersItemsController {
  constructor(private readonly ordersItemsService: OrdersItemsService) {}

  @MessagePattern('createOrdersItem')
  async create(@Payload() createOrdersItemDto: CreateOrdersItemDto) {
    
    const order = await this.ordersItemsService.create(createOrdersItemDto);
    const paymentSession = await this.ordersItemsService.createPaymentSession(order)

    return {
      order,
      paymentSession,
    }
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

  @EventPattern('payment.succeeded')
  paidOrder(@Payload() paidOrderDto: any ) {
    console.log({ paidOrderDto });
    return;
  }




}
