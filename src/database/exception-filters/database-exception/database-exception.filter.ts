import { ArgumentsHost, Catch } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { DatabaseError } from '../../interfaces/database-error.interface';
import { HttpError, IHttpError } from '../../../common/util/http-error-util';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter extends BaseExceptionFilter {
  private readonly FIELD_NAME_REGEX = /(?<=Key \()\w+/;
  private readonly FIELD_VALUE_REGEX = /(?<=\)=\().*?(?=\))/;

  catch(exception: DatabaseError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { code, detail, table } = exception;

    // const x = this.extractMessageData(detail)

    const { httpError, description } = this.createErrorData(code, detail);

    if (!httpError) {
      return super.catch(exception, host);
    }

    const { status, error } = httpError;
    const { fieldName, fieldValue } = this.extractMessageData(detail);
    const meta = { description, fieldName, fieldValue, table };

    response.status(status).json({
      statusCode: status,
      message: detail,
      error,
      meta,
    });
  }

  private extractMessageData(message: string) {
    const fieldName = message.match(this.FIELD_NAME_REGEX).at(0);
    const fieldValue = message.match(this.FIELD_VALUE_REGEX).at(0);
    return { fieldName, fieldValue };
  }

  private createErrorData(code: string, message: string) {
    let httpError: IHttpError;
    let description: string;

    switch (code) {
      case this.DatabaseErrorCode.ASSOCIATION_NOT_FOUND_OR_NOT_NULL_VIOLATION:
        switch (true) {
          case message.includes(this.MessageSnippet.ASSOCIATION_NOT_FOUND):
            httpError = HttpError.NOT_FOUND;
            description = this.Description.ASSOCIATION_NOT_FOUND;
            break;

          case message.includes(this.MessageSnippet.NOT_NULL_VIOLATION):
            httpError = HttpError.CONFLICT;
            description = this.Description.NOT_NULL_VIOLATION;
            break;
        }
        break;

      case this.DatabaseErrorCode.UNIQUE_VIOLATION:
        httpError = HttpError.CONFLICT;
        description = this.Description.UNIQUE_VIOLATION;
        break;
    }

    return { httpError, description };
  }

  private readonly DatabaseErrorCode = {
    ASSOCIATION_NOT_FOUND_OR_NOT_NULL_VIOLATION: '23503',
    UNIQUE_VIOLATION: '23505',
  } as const satisfies Record<string, string>;

  private readonly MessageSnippet = {
    ASSOCIATION_NOT_FOUND: 'is not present',
    NOT_NULL_VIOLATION: 'is still referenced',
  } as const satisfies Record<string, string>;

  private readonly Description = {
    ASSOCIATION_NOT_FOUND: 'Associated entity not found',
    NOT_NULL_VIOLATION: 'Cannot delete due to NOT NULL constraint',
    UNIQUE_VIOLATION: 'Unique constraint violation',
  } as const satisfies Record<string, string>;
}
