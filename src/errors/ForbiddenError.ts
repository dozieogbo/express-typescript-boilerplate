import { HttpError } from 'routing-controllers';

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(403, message || 'You are not allowed to access this resource.');
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}
