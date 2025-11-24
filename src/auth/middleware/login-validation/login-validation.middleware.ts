import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { LoginDto } from '../../dto/login.dto';
import { validate } from 'class-validator';

export const ValidationMiddlewareFactory = <TDTO extends Type>(DTO: TDTO) => {
  @Injectable()
  class ValidationMiddleware implements NestMiddleware {
    async use(req: Request, _res: Response, next: NextFunction) {
      const dto = plainToInstance(DTO, req.body);
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      if (errors.length) {
        const messages = errors.flatMap((error) =>
          Object.values(error.constraints),
        );
        throw new BadRequestException(messages);
      }
      next();
    }
  }

  return ValidationMiddleware;
};
