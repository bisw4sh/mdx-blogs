import { Router } from "express";
import { HealthController } from "@/controllers/health-check.controller.js";
import { catchAsync } from "@/utils/catchAsync.util.js";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { createApiResponse } from "@/open-api/openAPIResponseBuilders.js";

const router = Router();
export const healthCheckRegistry = new OpenAPIRegistry();
const prefix = "/api/health-check";

healthCheckRegistry.registerPath({
  method: "get",
  path: prefix,
  tags: ["Health Check"],
  responses: createApiResponse(
    z.object({
      name: z.string().optional(),
    }),
    "checking if server is running or not"
  ),
});

router.get("/", catchAsync(HealthController.check));

export default router;
