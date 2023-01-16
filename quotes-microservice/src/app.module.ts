import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuoteModule } from './modules/quote/quote.module';
import { ConfigModule } from '@nestjs/config';
import { makeCounterProvider, PrometheusModule } from '@willsoto/nestjs-prometheus';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './custom-exception.filter';

@Module({
  imports: [
    PrometheusModule.register(),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(
      `${process.env.DATABASE_PREFIX}://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:27017/${process.env.DATABASE_NAME}`),
    QuoteModule
  ],
  controllers: [
  ],
  providers: [
    makeCounterProvider({
      name: "number_of_requests",
      help: "counts the number of requests that each endpoint received",
      labelNames: ['status', 'endpoint', 'req_id']
    }),
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    }
  ],
})
export class AppModule { }
