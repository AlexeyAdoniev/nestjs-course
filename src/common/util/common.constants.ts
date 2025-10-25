import { ValidationPipeOptions } from '@nestjs/common';

const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};

const DEFAULT_PAGE_SIZE = {
  USER: 10,
  ORDER: 5,
  PRODUCT: 20,
} as const satisfies Record<string, number>;

export { VALIDATION_PIPE_OPTIONS, DEFAULT_PAGE_SIZE };
