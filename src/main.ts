import { Logger, ValidationPipe } from '@nestjs/common'
import { envs } from './config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Order-MS')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, 
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )

  await app.listen();

  logger.log(`Order Microservice running on port ${ envs.port }`)

}
bootstrap();
