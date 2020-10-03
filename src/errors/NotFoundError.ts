import { HttpError } from 'routing-controllers';

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message || 'Resource not found');
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}
