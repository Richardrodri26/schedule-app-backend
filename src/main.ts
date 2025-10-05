import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
