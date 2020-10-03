import { HttpError } from 'routing-controllers';

export class BadRequestError extends HttpError {
  private property: string;
  private errorMessage: string;

  constructor(message: string, property?: string) {
    super(400, 'Invalid request');

    this.property = property;
    this.errorMessage = message;
  }

  toJSON() {
    return {
      message: this.message,
      errors: [
        {
          message: this.errorMessage,
          property: this.property,
        },
      ],
    };
  }
}
