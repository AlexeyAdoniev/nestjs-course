import * as Joi from 'joi';

export const ENV_VALIDATION_SCHEEMA = Joi.object({
  DB_PASS: Joi.required(),
  JTW_SECRET: Joi.required(),
  JTW_TTL: Joi.required(),
});
