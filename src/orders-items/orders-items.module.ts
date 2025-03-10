import { Module } from '@nestjs/common';
import { OrdersItemsService } from './orders-items.service';
import { OrdersItemsController } from './orders-items.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICE, PRODUCT_SERVICE } from 'src/config';

@Module({
  controllers: [OrdersItemsController],
  providers: [OrdersItemsService],
  imports:[
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          //host: envs.productsMicroserviceHost,
          //port: envs.productsMicroservicePort,
        }
      }
    ])
  ]
})
export class OrdersItemsModule {}
