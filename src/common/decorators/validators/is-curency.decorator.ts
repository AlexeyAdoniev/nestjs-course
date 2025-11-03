import { applyDecorators } from '@nestjs/common';
import {
  IsInt,
  IsNumber,
  IsPositive,
  ValidationOptions,
} from 'class-validator';

/**
 * 
 @description Positive Currency
 */
export const IsCurrency = (
  validationsOptions?: ValidationOptions,
): PropertyDecorator =>
  applyDecorators(
    IsNumber({ maxDecimalPlaces: 2 }, validationsOptions),
    IsPositive(validationsOptions),
  );
