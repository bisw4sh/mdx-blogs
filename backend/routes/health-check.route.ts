import { Router } from "express";
import { HealthController } from "@/controllers/health-check.controller.js";
import { catchAsync } from "@/utils/catchAsync.util.js";

const router = Router();

router.get("/", catchAsync(HealthController.check));

export default router;
