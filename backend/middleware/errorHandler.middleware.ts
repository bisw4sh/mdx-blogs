import type { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/appError.util.js";
import multer from "multer";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response<any> => {
  console.log("error", error);

  if (error instanceof AppError) {
    return res.status(+error?.statusCode || 400).json({
      success: false,
      message: error?.message ?? "Internal server error",
      data: null,
    });
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: "File Size Exceeded. Please upload within 8MB",
      details: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    data: null,
  });
};

export default errorHandler;
