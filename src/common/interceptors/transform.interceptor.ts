import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorator/response-message.decorator';
export interface StandardResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    const handler = context.getHandler();
    const customMessage = this.reflector.get<string>(
      RESPONSE_MESSAGE_KEY,
      handler,
    );

    return next.handle().pipe(
      map((data) => ({
        statusCode: statusCode,
        message: customMessage || 'Request successful', // Or a dynamic message based on status/method
        data: data,
      })),
    );
  }
}

export const TransformInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: TransformInterceptor,
};
