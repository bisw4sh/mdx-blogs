import { Request, Response } from "express";
import { __dirname } from "../getPath";
import { writeFile } from "fs/promises";
import path from "path";

export const save_mdx = async (req: Request, res: Response) => {
  try {
    const { markdown, filename } = req.body;
    console.log(markdown, filename);

    const fileOperation = await writeFile(
      path.join(__dirname, "files", `${filename}.mdx`),
      markdown
    );
    console.log(fileOperation);
    res.status(201).json({ message: "successfully created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error writing file" });
  }
};
