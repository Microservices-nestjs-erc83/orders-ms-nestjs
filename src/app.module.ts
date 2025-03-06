import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { OrdersItemsModule } from './orders-items/orders-items.module';

@Module({
  imports: [OrdersModule, OrdersItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
