import { bundleMDX } from "mdx-bundler";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import remarkGfm from "remark-gfm";
import { AppError } from "@/utils/appError.util.js";
import { MDXContent } from "@/types/mdx.types.js";
import { __dirname } from "@/utils/getPath.util.js";

export class PostService {
  private static getMDXDir() {
    return path.join(__dirname, "public", "mdx-files");
  }

  static async checkPostBySlug(slug: string): Promise<{ fileExist: boolean }> {
    const mdxDir = this.getMDXDir();
    const files = readdirSync(mdxDir);

    const fileExist = files.some(
      (file) => file === `${slug}.mdx` || file === `${slug}.md`
    );

    if (fileExist) {
      throw AppError.conflict("File already exists");
    }

    return { fileExist };
  }

  static async getAllPosts(): Promise<string[]> {
    try {
      const mdxDir = this.getMDXDir();
      return readdirSync(mdxDir)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.replace(".mdx", ""));
    } catch (error) {
      throw AppError.internalServerError("Failed to fetch MDX files");
    }
  }

  static async getPostBySlug(slug: string): Promise<MDXContent> {
    try {
      const filePath = path.join(this.getMDXDir(), `${slug}.mdx`);
      const mdxContent = readFileSync(filePath, "utf-8");

      const { code, frontmatter } = await bundleMDX({
        source: mdxContent,
        mdxOptions(options) {
          options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
          options.development = false;
          return options;
        },
      });

      return { code, frontmatter };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalServerError("Failed to process MDX content");
    }
  }

  static async savePost(
    content: string,
    fileName: string
  ): Promise<MDXContent> {
    try {
      const filePath = path.join(this.getMDXDir(), fileName);
      writeFileSync(filePath, content);

      const { code, frontmatter } = await bundleMDX({
        source: content,
        mdxOptions(options) {
          options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
          options.development = false;
          return options;
        },
      });

      return { code, frontmatter };
    } catch (error) {
      throw AppError.internalServerError("Failed to save MDX file");
    }
  }

  static async processMDX(
    content: string,
    fileName: string
  ): Promise<MDXContent> {
    try {
      const filePath = path.join(this.getMDXDir(), `${fileName}.mdx`);
      writeFileSync(filePath, content);

      const { code, frontmatter } = await bundleMDX({
        source: content,
        mdxOptions(options) {
          options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
          options.development = false;
          return options;
        },
      });

      return { code, frontmatter };
    } catch (error) {
      throw AppError.internalServerError("Failed to process MDX content");
    }
  }
}
