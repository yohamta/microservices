export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor() {
    super();

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
