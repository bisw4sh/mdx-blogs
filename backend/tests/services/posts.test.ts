import { describe, it, expect, vi, beforeEach } from "vitest";
import { PostService } from "@/services/posts.service.js";
import { AppError } from "@/utils/appError.util.js";
import fs from "node:fs";
import path from "node:path";
import { logger } from "@/config/winston.config.js";
import { bundleMDX } from "mdx-bundler";

// Mock dependencies
vi.mock("node:fs");
vi.mock("mdx-bundler", () => ({
  bundleMDX: vi.fn().mockResolvedValue({ code: "mockedCode", frontmatter: {} }),
}));
vi.mock("@/config/winston.config.js", () => ({
  logger: {
    error: vi.fn(),
  },
}));

const mockDir = "/mock/public/mdx-files";
// Removed invalid spyOn for getMDXDir

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PostService", () => {
  describe("checkPostBySlug", () => {
    it("should throw conflict error if file exists with .mdx extension", async () => {
      fs.readdirSync = vi.fn().mockReturnValue(["existing.mdx", "other.mdx"]);
      await expect(PostService.checkPostBySlug("existing")).rejects.toThrow(
        "File already exists"
      );
      expect(fs.readdirSync).toHaveBeenCalledWith(mockDir);
    });

    it("should throw conflict error if file exists with .md extension", async () => {
      fs.readdirSync = vi.fn().mockReturnValue(["existing.md", "other.mdx"]);
      await expect(PostService.checkPostBySlug("existing")).rejects.toThrow(
        "File already exists"
      );
    });

    it("should return fileExist false if file does not exist", async () => {
      fs.readdirSync = vi.fn().mockReturnValue(["other.mdx"]);
      await expect(
        PostService.checkPostBySlug("non-existing")
      ).resolves.toEqual({ fileExist: false });
    });
  });

  describe("getAllPosts", () => {
    it("should return all MDX files without extension", async () => {
      fs.readdirSync = vi
        .fn()
        .mockReturnValue(["post1.mdx", "post2.mdx", "readme.md"]);
      const posts = await PostService.getAllPosts();
      expect(posts).toEqual(["post1", "post2"]);
      expect(fs.readdirSync).toHaveBeenCalledWith(mockDir);
    });

    it("should throw an error if fetching fails", async () => {
      fs.readdirSync = vi.fn(() => {
        throw new Error("Read error");
      });
      await expect(PostService.getAllPosts()).rejects.toThrow(
        "Failed to fetch MDX files"
      );
      expect(logger.error).toHaveBeenCalledWith("failed to fetch mdx files");
    });
  });

  describe("getPostBySlug", () => {
    it("should return bundled MDX content", async () => {
      fs.readFileSync = vi.fn().mockReturnValue("# Mocked MDX content");
      const result = await PostService.getPostBySlug("test-post");

      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.join(mockDir, "test-post.mdx"),
        "utf-8"
      );
      expect(bundleMDX).toHaveBeenCalled();
      expect(result).toEqual({ code: "mockedCode", frontmatter: {} });
    });

    it("should throw an error if processing fails", async () => {
      fs.readFileSync = vi.fn(() => {
        throw new Error("Read error");
      });
      await expect(PostService.getPostBySlug("test-post")).rejects.toThrow(
        "Failed to process MDX content"
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to process MDX content"
      );
    });

    it("should propagate AppError if thrown", async () => {
      fs.readFileSync = vi.fn(() => {
        throw new AppError("Custom error", 400);
      });
      await expect(PostService.getPostBySlug("test-post")).rejects.toThrow(
        "Custom error"
      );
    });
  });

  describe("savePost", () => {
    it("should save the file and return processed content", async () => {
      fs.writeFileSync = vi.fn();
      const result = await PostService.savePost("# Mock Content", "test.mdx");

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockDir, "test.mdx"),
        "# Mock Content"
      );
      expect(bundleMDX).toHaveBeenCalled();
      expect(result).toEqual({ code: "mockedCode", frontmatter: {} });
    });

    it("should throw an error if saving fails", async () => {
      fs.writeFileSync = vi.fn(() => {
        throw new Error("Write error");
      });
      await expect(
        PostService.savePost("# Mock Content", "test.mdx")
      ).rejects.toThrow("Failed to save MDX file");
      expect(logger.error).toHaveBeenCalledWith("Failed to save MDX file");
    });
  });

  describe("processMDX", () => {
    it("should process and save MDX content", async () => {
      fs.writeFileSync = vi.fn();
      const result = await PostService.processMDX("# Mock Content", "test");

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(mockDir, "test.mdx"),
        "# Mock Content"
      );
      expect(bundleMDX).toHaveBeenCalledWith({
        source: "# Mock Content",
        mdxOptions: expect.any(Function),
      });
      expect(result).toEqual({ code: "mockedCode", frontmatter: {} });
    });

    it("should throw an error if processing fails", async () => {
      fs.writeFileSync = vi.fn(() => {
        throw new Error("Write error");
      });
      await expect(
        PostService.processMDX("# Mock Content", "test")
      ).rejects.toThrow("Failed to process MDX content");
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to process MDX content"
      );
    });
  });
});
