import { HttpStatus } from '@nestjs/common';
import { CustomResponse } from './constants';

export const isEntityExist = (entity: any, name: string): CustomResponse => {
  if (entity) {
    return entity;
  }

  return {
    statusCode: HttpStatus.NOT_FOUND,
    message: `${name} not found`,
  };
};
