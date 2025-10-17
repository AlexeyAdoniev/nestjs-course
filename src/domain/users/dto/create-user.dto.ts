import {
  IsString,
  IsOptional,
  Length,
  IsEmail,
  IsPhoneNumber,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  readonly name: string;
  @IsInt()
  readonly email: number;
  @IsString()
  readonly password: string;
  @IsPhoneNumber()
  readonly phone: string;
}
