import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { createApiResponse } from "@/open-api/openAPIResponseBuilders.js";

import { Router } from "express";
import { PostController } from "@/controllers/posts.controller.js";
import { mdxUpload } from "@/config/multer.config.js";
import { catchAsync } from "@/utils/catchAsync.util.js";

export const postsRegistry = new OpenAPIRegistry();
const router: Router = Router();
const prefix = "/api/posts";

postsRegistry.registerPath({
  method: "get",
  path: prefix,
  tags: ["Posts"],
  responses: createApiResponse(
    z.object({
      name: z.string().optional(),
    }),
    "receives the name of the posts"
  ),
});

router.get("/", catchAsync(PostController.getAllPosts));

postsRegistry.registerPath({
  method: "get",
  path: `${prefix}/{slug}`,
  tags: ["Posts"],
  responses: createApiResponse(
    z.object({
      name: z.string().optional(),
    }),
    "receives the post by slug"
  ),
});

router.get("/:slug", catchAsync(PostController.getPostBySlug));

postsRegistry.registerPath({
  method: "get",
  path: `${prefix}/check/{slug}`,
  tags: ["Posts"],
  responses: createApiResponse(
    z.object({
      name: z.string().optional(),
    }),
    "return if the post name already or not"
  ),
});
router.get("/check/:slug", catchAsync(PostController.checkPostBySlug));

postsRegistry.registerPath({
  method: "post",
  path: `${prefix}/upload`,
  tags: ["Posts"],
  responses: createApiResponse(
    z.object({
      name: z.string().optional(),
    }),
    "route to upload the mdx file"
  ),
});

router.post(
  "/upload",
  mdxUpload.single("mdx"),
  catchAsync(PostController.uploadPost)
);

postsRegistry.registerPath({
  method: "post",
  path: `${prefix}/upload/json`,
  tags: ["Posts"],
  responses: createApiResponse(
    z.object({
      name: z.string().optional(),
    }),
    "return if the post in json format"
  ),
});
router.post("/upload/json", catchAsync(PostController.uploadPostAsText));

export default router;
