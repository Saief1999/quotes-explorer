import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { InjectMetric } from '@willsoto/nestjs-prometheus';
  import { Counter } from 'prom-client';
  import { v4 as uuidv4 } from 'uuid';

  @Catch(Error)
  export class CustomExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(CustomExceptionFilter.name);
  
    constructor(
      @InjectMetric('number_of_requests') private readonly counter: Counter<string>,
    ) { }
  
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      
      this.counter.inc({ status, endpoint: request.url })
  
      response
        .status(status)
        .json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }