import {
  ValidateBy,
  buildMessage,
  ValidationOptions,
  matches,
} from 'class-validator';
const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const IS_PASSWORD_KEY = 'isPassword';

function isPassword(value: string): boolean {
  return matches(value, regex);
}

export const IsPassword = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  ValidateBy(
    {
      name: IS_PASSWORD_KEY,
      validator: {
        validate: (value): boolean => isPassword(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be a valid password',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
