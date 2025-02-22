import { Router, type Request, type Response } from "express";
import { bundleMDX } from "mdx-bundler";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import remarkGfm from "remark-gfm";
import { __dirname } from "../getPath";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  try {
    const mdxDir = path.join(__dirname, "public", "mdx-files");
    const files = readdirSync(mdxDir)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(".mdx", ""));
    res.json({ posts: files });
  } catch (error) {
    console.error("Error fetching MDX files:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "public",
      "mdx-files",
      `${req.params.slug}.mdx`
    );
    const mdxContent = readFileSync(filePath, "utf-8");

    const { code, frontmatter } = await bundleMDX({
      source: mdxContent,
      mdxOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
        options.development = false;
        return options;
      },
    });

    res.json({ code, frontmatter });
  } catch (error) {
    console.error("MDX Bundling Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
