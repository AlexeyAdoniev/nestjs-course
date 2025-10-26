import {
  ArrayNotEmpty,
  ArrayUnique,
  IsNumber,
  IsOptional,
  IsPositive,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsCurrency } from '../../../common/decorators/is-curency.decorator';

import { IdDto } from '../../../common/dto/id.dto';
import { IsEntity } from '../../../common/decorators/is-entity.decorator';
import { idDtoIdentifier } from '../../../common/util/id.util';

export class CreateProductDto {
  @Length(2, 50)
  readonly name: string;

  @Length(1, 500)
  @IsOptional()
  readonly description: string;

  @IsCurrency()
  readonly price: number;

  @ArrayNotEmpty()
  @ArrayUnique(idDtoIdentifier)
  @IsEntity()
  readonly categories: IdDto[];
}
