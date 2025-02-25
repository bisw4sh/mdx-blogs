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

// Use if you want multiple responses for a single endpoint

// import { ResponseConfig } from '@asteasolutions/zod-to-openapi';
// import { ApiResponseConfig } from '@common/models/openAPIResponseConfig';
// export type ApiResponseConfig = {
//   schema: z.ZodTypeAny;
//   description: string;
//   statusCode: StatusCodes;
// };
// export function createApiResponses(configs: ApiResponseConfig[]) {
//   const responses: { [key: string]: ResponseConfig } = {};
//   configs.forEach(({ schema, description, statusCode }) => {
//     responses[statusCode] = {
//       description,
//       content: {
//         'application/json': {
//           schema: ServiceResponseSchema(schema),
//         },
//       },
//     };
//   });
//   return responses;
// }
