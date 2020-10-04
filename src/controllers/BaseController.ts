import { PaginatedResponse, Response } from '../models/dtos/Response';

interface Meta {
  total: number;
  page: number;
  pageSize: number;
}

export class BaseController {
  protected ok<T>(data: T, message?: string): Response<T> {
    return {
      message: message || 'Ok',
      data,
    };
  }

  protected paginated<T>(data: T[], meta: Meta): PaginatedResponse<T> {
    return {
      message: 'Ok',
      data: data,
      meta: {
        perPage: meta.pageSize,
        total: meta.total,
        count: data.length,
        currentPage: meta.page,
        totalPages: Math.ceil(meta.total / meta.pageSize),
      },
    };
  }
}
