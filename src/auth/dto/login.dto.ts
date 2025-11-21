import { IsEmail, Length } from 'class-validator';

import { IsPassword } from '../../common/decorators/validators/is-password.decorator';

export class LoginDto {
  @Length(2, 50)
  @IsEmail()
  readonly email: string;

  @IsPassword()
  readonly password: string;
}
