import type { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/appError.util.js";
import multer from "multer";
import { z } from "zod";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response => {
  console.error(error);
  if (error instanceof AppError) {
    return res.status(+error?.statusCode || 400).json({
      statusCode: error?.statusCode || 400,
      success: false,
      message: error?.message ?? "Internal server error",
      data: null,
    });
  }

  if (error instanceof z.ZodError) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: error.message,
      data: null,
    });
  }

  return res.status(500).json({
    statusCode: 500,
    success: false,
    message: "Internal Server Error",
    data: null,
  });
};

export default errorHandler;
