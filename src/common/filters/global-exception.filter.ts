import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DomainError } from '../errors/domain.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    //Erro de domínio
    if (exception instanceof DomainError) {
      status = exception.status ?? HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      //Erro HTTP do Nest
      status = exception.getStatus();
      message = exception.message;
    }

    // this.logger.error(
    //   {
    //     err: exception,
    //     method: request.method,
    //     path: request.url,
    //   },
    //   `HTTP ${request.method} ${request.url} ${status}`,
    // );

    // this.logger.error({
    //   err: exception,
    //   path: request.url,
    //   method: request.method,
    // });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}