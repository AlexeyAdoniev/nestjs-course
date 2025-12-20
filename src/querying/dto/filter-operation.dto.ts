import { IsIn, IsNumber } from 'class-validator';
import { ValidateFilterOperandsLength } from '../decorators/validate-filter-operands.decorator';

const Operator = ['lt', 'lte', 'gt', 'gte', 'eq', 'btw'] as const;
type Operator = (typeof Operator)[number];

export class FilterOperatorDto {
  @IsIn(Operator)
  readonly operator: Operator;
  @IsNumber({}, { each: true })
  readonly operands: number[];

  @ValidateFilterOperandsLength()
  private readonly manyFieldValidation: any;
}
