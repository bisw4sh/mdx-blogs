import { Express } from "express";
import healthCheckRoutes from "@/routes/health-check.route.js";
import postRoutes from "@/routes/posts.route.js";

export const routesHandler = (app: Express) => {
  app.use("/api/health-check", healthCheckRoutes);
  app.use("/api/posts", postRoutes);
};
