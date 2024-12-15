import { Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
        redact: ['req.headers.authorization'],
        timestamp: true,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
    ModulesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
