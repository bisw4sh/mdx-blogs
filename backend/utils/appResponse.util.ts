import { HttpStatusCode } from "@/constants/http.constants.js";

export class AppResponse<T = void> {
  statusCode: number;
  status: string;
  message: string;
  data?: T;

  constructor(message: string, statusCode: number, data?: T) {
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("2") ? "success" : "error";
    this.message = message;
    this.data = data;
  }

  static success<T>(message: string, data?: T) {
    return new AppResponse<T>(message, HttpStatusCode.OK, data);
  }

  static created<T>(message: string, data?: T) {
    return new AppResponse<T>(message, HttpStatusCode.CREATED, data);
  }

  static updated<T>(message: string, data?: T) {
    return new AppResponse<T>(message, HttpStatusCode.OK, data);
  }
  static noContent<T>(message: string, data?: T) {
    return new AppResponse<T>(message, HttpStatusCode.OK, data);
  }
}
