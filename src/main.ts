import { Logger } from '@nestjs/common'
import { envs } from './config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const logger = new Logger('Order-MS')

  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`Order Microservice running on port ${ envs.port }`)

}
bootstrap();
