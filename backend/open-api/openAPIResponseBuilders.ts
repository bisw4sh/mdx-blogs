import type { z } from "zod";

import { AppResponseSchema } from "@/utils/appResponse.util.js";

export function createApiResponse(
  schema: z.ZodTypeAny,
  description: string,
  statusCode = 200
) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: AppResponseSchema(schema),
        },
      },
    },
  };
}
