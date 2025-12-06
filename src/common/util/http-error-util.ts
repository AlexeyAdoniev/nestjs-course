import { HttpStatus } from '@nestjs/common';

export const HttpError = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
  CONFLICT: {
    status: HttpStatus.CONFLICT,
    error: 'Conflict',
  },
} as const satisfies Record<string, IHttpError>;

export interface IHttpError {
  readonly status: HttpStatus;
  readonly error: string;
}
