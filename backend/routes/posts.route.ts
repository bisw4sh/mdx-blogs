import { Router } from "express";
import { PostController } from "@/controllers/posts.controller.js";
import { mdxUpload } from "@/config/multer.config.js";
import { catchAsync } from "@/utils/catchAsync.util.js";

const router = Router();

router.get("/", catchAsync(PostController.getAllPosts));
router.get("/:slug", catchAsync(PostController.getPostBySlug));
router.get("/check/:slug", catchAsync(PostController.checkPostBySlug));
router.post(
  "/upload",
  mdxUpload.single("mdx"),
  catchAsync(PostController.uploadPost)
);
router.post("/upload/json", catchAsync(PostController.uploadPostAsText));

export default router;
