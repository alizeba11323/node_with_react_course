import HTTP_STATUS_CODES from 'http-status-codes';
export interface IErrorHandler {
  message: string;
  statusCode: number;
  status: string;
  serializeError: () => IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}
export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }
  serializeError(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status
    };
  }
}

class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
  status = 'Bad Request';
  constructor(message: string) {
    super(message);
  }
}
class JoiValidationError extends CustomError {
  statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
  status = 'Joi Validation Bad Request';
  constructor(message: string) {
    super(message);
  }
}
class RequestTooLargeError extends CustomError {
  statusCode = HTTP_STATUS_CODES.SERVICE_UNAVAILABLE;
  status = 'File Too Large';
  constructor(message: string) {
    super(message);
  }
}
class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS_CODES.NOT_FOUND;
  status = 'Not Found Error';
  constructor(message: string) {
    super(message);
  }
}
class UnAuthorizedError extends CustomError {
  statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
  status = 'UnAuthorized Error';
  constructor(message: string) {
    super(message);
  }
}
