import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/open-api/openAPIResponseBuilders.js";

import { Router } from "express";
import { PostController } from "@/controllers/posts.controller.js";
import { mdxUpload } from "@/config/multer.config.js";
import { catchAsync } from "@/utils/catchAsync.util.js";
import {
  getPostNamesSchema,
  mdxPostData,
  postExistsOrNot,
} from "@/schemas/posts.schemas.js";

export const postsRegistry = new OpenAPIRegistry();
const router: Router = Router();
const prefix = "/api/posts";

postsRegistry.registerPath({
  method: "get",
  path: prefix,
  tags: ["Posts"],
  responses: createApiResponse(
    getPostNamesSchema,
    "receives the name of the posts"
  ),
});

router.get("/", catchAsync(PostController.getAllPosts));

postsRegistry.registerPath({
  method: "get",
  path: `${prefix}/{slug}`,
  tags: ["Posts"],
  parameters: [
    {
      name: "slug",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
      description: "The unique slug of the post to retrieve",
    },
  ],
  responses: createApiResponse(mdxPostData, "receives the post by slug"),
});

router.get("/:slug", catchAsync(PostController.getPostBySlug));

postsRegistry.registerPath({
  method: "get",
  path: `${prefix}/check/{slug}`,
  tags: ["Posts"],
  parameters: [
    {
      name: "slug",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: createApiResponse(
    postExistsOrNot,
    "return if the post name already or not"
  ),
});
router.get("/check/:slug", catchAsync(PostController.checkPostBySlug));

postsRegistry.registerPath({
  method: "post",
  path: `${prefix}/upload`,
  tags: ["Posts"],
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              mdx: {
                type: "string",
                format: "binary",
                description: "MDX file to upload (.mdx)",
              },
            },
            required: ["mdx"],
          },
        },
      },
    },
  },
  responses: createApiResponse(mdxPostData, "route to upload the mdx file"),
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
  request: {
    body: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description: "The MDX content as text",
              },
              fileName: {
                type: "string",
                description: "Name for the file to be saved",
              },
            },
            required: ["content", "fileName"],
          },
        },
      },
    },
  },
  responses: createApiResponse(
    mdxPostData,
    "return if the post in json format is successfully uploaded"
  ),
});

router.post("/upload/json", catchAsync(PostController.uploadPostAsText));

export default router;
