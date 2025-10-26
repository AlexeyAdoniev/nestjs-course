import { applyDecorators } from '@nestjs/common';
import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IdDto } from '../dto/id.dto';

/**
 * 
 @description Object with serial id
 */
export const IsEntity = (): PropertyDecorator =>
  applyDecorators(
    IsDefined(),
    ValidateNested(),
    Type(() => IdDto),
  );
