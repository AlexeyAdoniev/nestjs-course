import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnprocessableEntityException,
} from '@nestjs/common';
import bytes from 'bytes';
import { Response } from 'express';
import { extension } from 'mime-types';
import { HttpError, IHttpError } from '../../../common/util/http-error-util';

@Catch()
export class FilesExceptionFilter<T> implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { message } = exception;

    const { httpError, ...meta } = this.createErrorData(message);

    const { status, error } = httpError;

    response.status(status).json({
      statusCode: status,
      message,
      error,
      meta,
    });
  }

  private extractFileTypes(message: string) {
    const mediaTypesStr = message.match(this.FILE_TYPES_REGEX).at(0);

    let mediaTypes = mediaTypesStr.split('|');

    mediaTypes = mediaTypes.map((type) => type.replace('\\', ''));

    return mediaTypes.map((type) => extension(type));
  }

  private extractMaxSize(message: string) {
    const maxSizeStr = message.match(this.MAX_FILE_SIZE_REGEX).at(0);

    const maxSizeBytes = +maxSizeStr;

    const maxSize = bytes(maxSizeBytes);
    return maxSize;
  }

  private createErrorData(message: string) {
    let httpError: IHttpError;
    let description: string;

    let maxSize: string;
    let expectedFileTypes: (string | false)[];

    switch (true) {
      case message.includes(this.MessageSnippet.MAX_SIZE):
        httpError = HttpError.PAYLOAD_TOO_LARGE;
        maxSize = this.extractMaxSize(message);
        break;

      case message.includes(this.MessageSnippet.FILE_TYPE):
        httpError = HttpError.UNSUPPORTED_MEDIA_TYPE;
        description = this.Description.FILE_TYPE;
        expectedFileTypes = this.extractFileTypes(message);
        break;

      case message.includes(this.MessageSnippet.FILE_SIGNATURE):
        httpError = HttpError.UNSUPPORTED_MEDIA_TYPE;
        description = this.Description.FILE_SIGNATURE;
        break;

      default:
        httpError = HttpError.BAD_REQUEST;
    }

    return { httpError, description, maxSize, expectedFileTypes };
  }

  private readonly MAX_FILE_SIZE_REGEX = /(?<=less than )\d+/;
  private readonly FILE_TYPES_REGEX = /(?<=\/).*(?=\/)/;

  private readonly MessageSnippet = {
    MAX_SIZE: 'expected size',
    FILE_TYPE: 'expected type',
    FILE_SIGNATURE: 'does not match',
  } as const satisfies Record<string, string>;

  private readonly Description = {
    FILE_TYPE: 'Invalid file type',
    FILE_SIGNATURE: 'File type tampered',
  } as const satisfies Record<string, string>;
}
