import type { Request, Response } from "express";
import { AppResponse } from "@/utils/appResponse.util.js";
import { HealthService } from "@/services/health.service.js";

export class HealthController {
  static async check(_req: Request, res: Response) {
    const healthData = await HealthService.check();
    const response = AppResponse.success("Health Checked", {
      healthData,
    });
    res.status(response.statusCode).json(response);
    return;
  }
}
