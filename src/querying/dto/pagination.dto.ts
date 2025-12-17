import { IsOptional, Max } from 'class-validator';
import { IsCardinal } from '../../common/decorators/validators/is-cardinal.decorator';
import { MAX_PAGE_SIZE, MAX_PAGE_NUMBER } from '../util/querying.constants';

export class PaginationDto {
  @IsCardinal()
  @Max(MAX_PAGE_SIZE)
  @IsOptional()
  readonly limit?: number;
  @IsCardinal()
  @Max(MAX_PAGE_NUMBER)
  @IsOptional()
  readonly page?: number = 1;
}
