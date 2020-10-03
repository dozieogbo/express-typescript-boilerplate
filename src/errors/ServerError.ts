import { HttpError } from 'routing-controllers';

export class ServerError extends HttpError {
  constructor(message: string) {
    super(500, message || 'An unexpected error has occured');
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}
