import { IsOptional, IsPositive } from 'class-validator';
import { IsCardinal } from '../decorators/validators/is-cardinal.decorator';

export class PaginationDto {
  @IsCardinal()
  @IsOptional()
  limit?: number;
  @IsCardinal()
  @IsOptional()
  offset?: number;
}
