import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Configure body parser to provide raw body for webhook signature verification
  app.use(json({
    verify: (req: any, res, buf) => {
      // Store raw body for signature verification
      req.rawBody = buf;
    }
  }));
  // set global prefix for all routes
  app.setGlobalPrefix('api');

  app.useLogger(app.get(Logger));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
