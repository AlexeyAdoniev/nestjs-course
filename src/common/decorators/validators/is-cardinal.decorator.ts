import { applyDecorators } from '@nestjs/common';
import { IsInt, IsPositive, ValidationOptions } from 'class-validator';

/**
 * 
 @description Positive Integer
 */
export const IsCardinal = (
  validationsOptions?: ValidationOptions,
): PropertyDecorator =>
  applyDecorators(IsInt(validationsOptions), IsPositive(validationsOptions));
