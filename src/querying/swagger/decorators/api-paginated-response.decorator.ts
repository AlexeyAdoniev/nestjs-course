import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { application } from 'express';
import { PaginationMeta } from '../schemas/pagination-metadata.schema';

export const ApiPaginatedResponse = <TModel extends Type>(module: TModel) =>
  applyDecorators(
    ApiExtraModels(PaginationMeta),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${module.name}`,
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(module) },
          },
          meta: {
            $ref: getSchemaPath(PaginationMeta),
          },
        },
      },
    }),
  );
