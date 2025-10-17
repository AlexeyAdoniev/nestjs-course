import { Length, IsEmail } from 'class-validator';

export class CreateEmailDto {
  @IsEmail()
  readonly email: string;
  @Length(2, 50)
  readonly provider: string;
}
