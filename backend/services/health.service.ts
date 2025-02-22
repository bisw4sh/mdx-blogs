import { AppError } from "@/utils/appError.util.js";

export class HealthService {
  static async check(): Promise<string> {
    try {
      return "Server is up and running";
    } catch (error) {
      throw AppError.internalServerError("Something went wrong");
    }
  }
}
