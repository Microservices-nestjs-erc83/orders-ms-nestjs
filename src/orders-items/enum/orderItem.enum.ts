import { OrderStatus } from '@prisma/client'


export const OrderItemStatusList = [
    OrderStatus.PENDING,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
]
