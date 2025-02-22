import { HttpStatusCode } from "@/constants/http.constants.js";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  status: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string) {
    return new AppError(message, HttpStatusCode.BAD_REQUEST);
  }
  static unAuthorized(message: string) {
    return new AppError(message, HttpStatusCode.UNAUTHORIZED);
  }

  static forbidden(message: string) {
    return new AppError(message, HttpStatusCode.FORBIDDEN);
  }

  static notFound(message: string) {
    return new AppError(message, HttpStatusCode.NOT_FOUND);
  }
  static conflict(message: string) {
    return new AppError(message, HttpStatusCode.CONFLICT);
  }

  static internalServerError(message: string) {
    return new AppError(message, HttpStatusCode.INTERNAL_SERVER);
  }
  static alreadyExists(message: string) {
    return new AppError(message, HttpStatusCode.CONFLICT);
  }

  static upstreamError(message: string) {
    return new AppError(message, HttpStatusCode.BAD_GATEWAY);
  }
}
