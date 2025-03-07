import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { OrderItemStatusList } from '../enum/orderItem.enum';

export class ChangeOrderItemStatusDto {

    @IsUUID(4)
    id: string;
    
    @IsEnum( OrderStatus, {
        message: `Valid status are ${ OrderItemStatusList }`
    })
    status: OrderStatus;

}