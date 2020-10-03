import { HttpError } from 'routing-controllers';

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message || 'Unauthorized');
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}
