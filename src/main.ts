import { Logger } from '@nestjs/common'
import { envs } from './config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Order-MS')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port: envs.port
    }
  });

  await app.listen();

  logger.log(`Order Microservice running on port ${ envs.port }`)

}
bootstrap();
