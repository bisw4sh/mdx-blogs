import { z } from "zod";

export const getPostNamesSchema = z.array(z.string());

export const getPostData = z.object({
  slug: z.string(),
});

export const mdxPostData = z.object({
  code: z.string().optional(),
  frontmatter: z.record(z.string(), z.any()).optional(),
});

export const postExistsOrNot = z.object({
  fileExist: z.boolean(),
});

export const postByFile = z.object({
  fileName: z.string(),
})