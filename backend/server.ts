import express from "express";
import path from "node:path";
import errorHandler from "@/middleware/errorHandler.middleware.js";
import { rootDir } from "@/utils/getPath.util.js";
import { openAPIRouter } from "@/open-api/openAPIRouter.js";
import { routesHandler } from "./middleware/routes.middleware.js";
import { logger } from "@/config/winston.config.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/public", express.static(path.join(rootDir, "./public")));

app.use(openAPIRouter);
routesHandler(app);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`Swagger - APIs @ http://localhost:${PORT}/api-docs`);
});

/** Handle Uncaught Exceptions (Sync Errors) */
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Exit process immediately (may be replaced with a graceful shutdown)
});

/** Handle Unhandled Promise Rejections (Async Errors) */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
  server.close(() => {
    console.info("Server closed due to unhandled rejection");
    process.exit(1);
  });
});

/** Graceful Shutdown on SIGINT (Ctrl+C) or SIGTERM (Docker, Kubernetes) */
const onCloseSignal = (signal: string) => {
  console.info(`\n${signal} received, shutting down...`);
  server.close(() => {
    console.info("Server closed successfully");
    process.exit(0);
  });

  // Force shutdown after 10s if close hangs (e.g., open DB connections)
  setTimeout(() => {
    console.error("Forcing shutdown...");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGINT", () => onCloseSignal("SIGINT"));
process.on("SIGTERM", () => onCloseSignal("SIGTERM"));
