import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { MESSAGES } from 'src/constants';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus()
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = exception.message;
    let additionalInfo = null;

    if (exception instanceof BadRequestException) {
      const exceptionRespons = exception.getResponse() as {
        message?: string | string[];
      };
      if (typeof exceptionRespons === 'object' && exceptionRespons['message']) {
        message = exceptionRespons['message'];
      }
    }

    if (exception instanceof ForbiddenException) {
      additionalInfo = 'USER_NOT_VERIFIED';
    }

    if (exception instanceof UnauthorizedException) {
      if (message === MESSAGES.user.invalidCredentials) {
        additionalInfo = 'INVALID_CREDENTIALS';
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      additionalInfo,
    });
  }
}
