import type { Request, Response } from "express";
import { __dirname } from "../getPath";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export const save_mdx = async (req: Request, res: Response) => {
  try {
    const { markdown, filename } = req.body;

    await writeFile(path.join(__dirname, "mdx-files", `${filename}.mdx`), markdown);

    res.status(201).json({ message: "successfully created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error writing file" });
  }
};
