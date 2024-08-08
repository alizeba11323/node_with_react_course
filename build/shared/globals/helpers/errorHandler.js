"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class CustomError extends Error {
    constructor(message) {
        super(message);
    }
    serializeError() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            status: this.status
        };
    }
}
exports.CustomError = CustomError;
class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.default.BAD_REQUEST;
        this.status = 'Bad Request';
    }
}
class JoiValidationError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.default.BAD_REQUEST;
        this.status = 'Joi Validation Bad Request';
    }
}
class RequestTooLargeError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.default.SERVICE_UNAVAILABLE;
        this.status = 'File Too Large';
    }
}
class NotFoundError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.default.NOT_FOUND;
        this.status = 'Not Found Error';
    }
}
class UnAuthorizedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.default.UNAUTHORIZED;
        this.status = 'UnAuthorized Error';
    }
}
//# sourceMappingURL=errorHandler.js.map