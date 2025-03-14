import { describe, it, expect } from "vitest";
import { HealthService } from "@/services/health.service.js";

describe("HealthService", () => {
  describe("check", () => {
    it("should return 'Server is up and running'", async () => {
      const result = await HealthService.check();
      expect(result).toBe("Server is up and running");
    });
  });
});
