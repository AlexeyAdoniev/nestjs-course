import {
  FileTypeValidator,
  FileValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { NonEmptyArray } from '../../common/util/array.utils';

import bytes from 'bytes';
import { lookup } from 'mime-types';
import { FileSignature } from '../validators/file-signature.validator';

type FileSize = `${number}${'B' | 'KB' | 'MB'}`;
type FileType = 'png' | 'jpeg' | 'pdf';

const createFileTypeRegex = (fileTypes: FileType[]) => {
  const mediaTypes = fileTypes.map(lookup);
  return new RegExp(mediaTypes.join('|'), 'g');
};

export const createFileValidators = (
  maxSize: FileSize,
  fileTypes: FileType[],
): FileValidator[] => {
  const fileTypesRegex = createFileTypeRegex(fileTypes);
  return [
    new MaxFileSizeValidator({ maxSize: bytes(maxSize) }),
    new FileTypeValidator({ fileType: fileTypesRegex }),
    new FileSignature(),
  ];
};

export const createParseFilePipe = (
  maxSize: FileSize,
  fileTypes: NonEmptyArray<FileType>,
) =>
  new ParseFilePipe({
    validators: createFileValidators(maxSize, fileTypes),
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
