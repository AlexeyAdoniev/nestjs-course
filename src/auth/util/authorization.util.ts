import { ForbiddenException } from '@nestjs/common';

export const compareUserId = (userId: number, requeredId: number) => {
  if (userId !== requeredId) {
    throw new ForbiddenException();
  }
};
