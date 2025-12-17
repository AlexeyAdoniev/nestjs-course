import { Injectable } from '@nestjs/common';
import { PaginationMeta } from './interfaces/pagination-metadata.interface';

@Injectable()
export class PaginationService {
  calcOffset(limit: number, page: number) {
    return (page - 1) * limit;
  }

  createMeta(limit: number, page: number, count: number): PaginationMeta {
    const totalPages = Math.ceil(count / limit);
    if (page > totalPages) return;

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      itemsPerPage: limit,
      totalItems: count,
      currentPage: page,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  }
}
