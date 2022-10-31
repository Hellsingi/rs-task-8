import { HttpStatus } from '@nestjs/common';
import { CustomResponse } from './constants';

export const createResponse = (
  statusCode: HttpStatus,
  message: string,
  body?: any,
  error?: string,
): (CustomResponse & { body: any }) | (CustomResponse & { error: string }) => {
  const responseData = {
    statusCode,
    message,
  };

  if (body) {
    return { ...responseData, body };
  }

  if (error) {
    return { ...responseData, error };
  }
};
