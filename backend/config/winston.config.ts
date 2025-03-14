import winston, { format } from "winston";
import path from "path";
import { rootDir } from "@/utils/getPath.util.js";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

export const logger = winston.createLogger({
  levels,
  level: "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json() 
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: format.combine(
        format.colorize(), 
        format.printf(({ timestamp, level, message, stack }) => {
          return stack
            ? `${timestamp} [${level}]: ${stack}`
            : `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),

    new winston.transports.File({
      filename: path.join(rootDir, "logs", "errors.log"),
      level: "error",
    }),

    new winston.transports.File({
      filename: path.join(rootDir, "logs", "http.log"),
      level: "http",
    }),

    new winston.transports.File({
      filename: path.join(rootDir, "logs", "combined.log"),
    }),
  ],
});
