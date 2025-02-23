import { Request, Response, NextFunction } from "express";
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
    if (!slug) {
      throw AppError.badRequest("Slug is required");
    }

    const post = await PostService.getPostBySlug(slug);
    const response = AppResponse.success("Post retrieved successfully", post);
    return res.status(response.statusCode).json(response);
  }

  static async checkPostBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { slug } = req.params;
      if (!slug) {
        throw AppError.badRequest("Slug is required");
      }

      const fileExist = await PostService.checkPostBySlug(slug);
      const response = AppResponse.success("Checked file existence", fileExist);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
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

  static async uploadPostAsText(req: Request, res: Response) {
    const { content, fileName } = req.body;
    if (!content || !fileName) {
      throw AppError.badRequest("No content or fileName provided");
    }

    const post = await PostService.processMDX(content, fileName);

    const response = AppResponse.created("Post uploaded successfully", post);
    return res.status(response.statusCode).json(response);
  }
}
