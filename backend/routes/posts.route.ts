import { Router } from "express";
import { PostController } from "@/controllers/posts.controller.js";
import { mdxUpload } from "@/config/multer.config.js";

const router = Router();

router.get("/", PostController.getAllPosts);
router.get("/:slug", PostController.getPostBySlug);
router.get("/check/:slug", PostController.checkPostBySlug);
router.post("/upload", mdxUpload.single("mdx"), PostController.uploadPost);
router.post("/upload/json", PostController.uploadPostAsText);

export default router;
