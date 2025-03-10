import { Module } from '@nestjs/common';
import { OrdersItemsService } from './orders-items.service';
import { OrdersItemsController } from './orders-items.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICE, PRODUCT_SERVICE } from 'src/config';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [OrdersItemsController],
  providers: [OrdersItemsService],
  imports:[
    NatsModule,
  ]
})
export class OrdersItemsModule {}
