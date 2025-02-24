import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { rootDir } from "@/utils/getPath.util.js";
import { AppError } from "@/utils/appError.util.js";

const mdxDir = path.join(rootDir, "public", "mdx-files");

if (!fs.existsSync(mdxDir)) {
  fs.mkdirSync(mdxDir, { recursive: true });
}

export const mdxUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, mdxDir);
    },
    filename: (_req, file, cb) => {
      const fileName = file.originalname.endsWith(".mdx")
        ? file.originalname
        : `${file.originalname}.mdx`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "text/markdown",
      "text/mdx",
      "application/octet-stream",
    ];
    if (
      !allowedTypes.includes(file.mimetype) &&
      !file.originalname.endsWith(".md") &&
      !file.originalname.endsWith(".mdx")
    ) {
      cb(
        new AppError(
          "Invalid file type. Only .md and .mdx files are allowed",
          400
        )
      );
      return;
    }
    cb(null, true);
  },
});
