import { HttpStatusCode } from "@/constants/http.constants.js";
import { z } from "zod";

export class AppResponse<T = void> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;

  constructor(message: string, statusCode: number, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = true;
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

export const AppResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
    statusCode: z.number(),
    isOperational: z.boolean().optional(),
  });
