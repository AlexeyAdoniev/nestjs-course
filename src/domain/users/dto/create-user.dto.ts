import {
  IsString,
  IsOptional,
  Length,
  IsEmail,
  IsPhoneNumber,
  IsInt,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  readonly name: string;
  @IsInt()
  readonly email: number;
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  readonly password: string;
  @IsPhoneNumber()
  readonly phone: string;
}
