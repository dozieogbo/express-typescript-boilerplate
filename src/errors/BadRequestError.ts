import { HttpError } from 'routing-controllers';

interface Error {
  message: string; 
  property?: string
}

export class BadRequestError extends HttpError {
  private errors: Error[];

  constructor({ message, property }: Error) {
    super(400, 'Invalid request');

    this.errors = [{
      message,
      property
    }];
  }

  toJSON() {
    return {
      message: this.message,
      errors: this.errors
    };
  }
}
