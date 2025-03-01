import { AppError } from "@/utils/appError.util.js";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

type RequestLocation = "body" | "query" | "params";

/**
 * middleware function that validates request data against a Zod schema
 * @param schema The Zod schema to validate against
 * @param location Where to find the data to validate (body, query, or params)
 * @returns Express middleware function
 */
export const validateSchema = (
  schema: z.ZodTypeAny,
  location: RequestLocation = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[location];

      const validationResult = schema.safeParse(dataToValidate);

      if (!validationResult.success) {
        const formattedErrors = validationResult.error.errors
          .map((err) => {
            return `${err.path.join(".")}: ${err.message}`;
          })
          .join(", ");

        throw new AppError(`Validation failed: ${formattedErrors}`, 400);
      }

      req[location] = validationResult.data;

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError("Validation error occurred", 400));
      }
    }
  };
};

/**
 * Creates a middleware function that validates file uploads using Zod
 * @param options Configuration options for file validation
 * @returns Express middleware function
 */
export const validateFile = (options: {
  required?: boolean;
  allowedMimeTypes?: string[];
  maxSize?: number;
  fieldName: string;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { required = true, allowedMimeTypes, maxSize, fieldName } = options;

      if (!req.file) {
        if (required) {
          throw new AppError(`File ${fieldName} is required`, 400);
        } else {
          return next();
        }
      }

      if (allowedMimeTypes && allowedMimeTypes.length > 0) {
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
          throw new AppError(
            `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`,
            400
          );
        }
      }

      if (maxSize && req.file.size > maxSize) {
        throw new AppError(
          `File size exceeds the limit of ${maxSize / 1024 / 1024} MB`,
          400
        );
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError("File validation error occurred", 400));
      }
    }
  };
};

/**
 * Combined middleware to validate both file uploads and standard data
 */
export const validateFileUpload = (options: {
  schema?: z.ZodTypeAny;
  fileOptions: {
    required?: boolean;
    allowedMimeTypes?: string[];
    maxSize?: number;
    fieldName: string;
  };
}) => {
  const { schema, fileOptions } = options;

  return [
    // First validate the file
    validateFile(fileOptions),

    // Then validate other data if schema is provided
    ...(schema ? [validateSchema(schema, "body")] : []),
  ];
};
