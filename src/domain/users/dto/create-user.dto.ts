import {
  IsString,
  IsOptional,
  Length,
  IsEmail,
  IsPhoneNumber,
  IsInt,
  Matches,
} from 'class-validator';
import { IsPassword } from '../../../common/decorators/validators/is-password.decorator';

export class CreateUserDto {
  @Length(2, 30)
  readonly name: string;
  @IsInt()
  readonly email: number;
  /**
   * Requires:
   * 1. 8 to 20 characters
   * 2. At least one
   * - Lowercase letter
   * - Uppercase letter
   * - Number
   * - Special character
   */
  @IsPassword()
  readonly password: string;
  @IsPhoneNumber()
  readonly phone: string;
}
