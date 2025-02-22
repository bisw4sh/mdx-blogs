import { Request, Response } from "express";
import { PostService } from "@/services/posts.service.js";
import { AppResponse } from "@/utils/appResponse.util.js";
import { AppError } from "@/utils/appError.util.js";
import { readFileSync } from "fs";

export class PostController {
  static async getAllPosts(_req: Request, res: Response) {
    const posts = await PostService.getAllPosts();
    const response = AppResponse.success("Posts retrieved successfully", {
      posts,
    });
    return res.status(response.statusCode).json(response);
  }

  static async getPostBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const post = await PostService.getPostBySlug(slug);
    const response = AppResponse.success("Post retrieved successfully", post);
    return res.status(response.statusCode).json(response);
  }

  static async uploadPost(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      throw AppError.badRequest("No file uploaded");
    }

    const content = readFileSync(file.path, "utf-8");
    const post = await PostService.savePost(content, file.filename);

    const response = AppResponse.created("Post uploaded successfully", {
      fileName: file.filename,
      ...post,
    });
    return res.status(response.statusCode).json(response);
  }
}
