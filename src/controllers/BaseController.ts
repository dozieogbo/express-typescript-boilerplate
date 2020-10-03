import { Response } from '../models/dtos/Response';

export class BaseController {
  protected ok<T>(data: T, message?: string): Response<T> {
    return {
      message: message || 'Ok',
      data,
    };
  }
}
