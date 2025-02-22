import { Router } from "express";
import { HealthController } from "@/controllers/health-check.controller.js";

const router = Router();

router.get("/", HealthController.check);

export default router;
