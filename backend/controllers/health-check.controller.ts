import type { Request, Response } from "express";
import { AppResponse } from "@/utils/appResponse.util.js";
import { HealthService } from "@/services/health.service.js";
import { logger } from "@/config/winston.config.js";

export class HealthController {
  static async check(_req: Request, res: Response) {
    logger.http("health-check");
    const healthData = await HealthService.check();
    const response = AppResponse.success("Health Checked", {
      healthData,
    });
    return res.status(response.statusCode).json(response);
  }
}
