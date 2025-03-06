import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderItemStatusList } from '../enum/orderItem.enum';
import { OrderStatus } from '@prisma/client';


export class OrderPaginationDto extends PaginationDto {


    @IsOptional()
    @IsEnum( OrderItemStatusList, {
        message: `Valid status are ${ OrderItemStatusList }`
    })
    status: OrderStatus;


}