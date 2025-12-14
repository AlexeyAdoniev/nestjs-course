import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class BodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const body = JSON.parse(request.body.body);
      request.body = body;
    } catch (err) {
      console.log(err);
      if (err instanceof SyntaxError)
        throw new BadRequestException(err.message);
      throw err;
    }

    return next.handle();
  }
}
