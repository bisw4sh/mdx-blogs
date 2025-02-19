import express from "express";
import path from "node:path";
import url from "node:url";
import { save_mdx } from "./controllers/save-mdx";
import "dotenv/config";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { readFileSync } from "node:fs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "./public")));

app.post("/api/save-mdx", save_mdx);

app.get("/api/posts/:slug", async (req, res) => {
  try {
    const mdxContent = readFileSync(
      path.join(__dirname, "public", "mdx-files", `${req.params.slug}.mdx`),
      "utf-8"
    );

    // Updated compilation options for MDX v3
    const compiled = await compile(mdxContent, {
      remarkPlugins: [remarkGfm],
      jsx: true,
      format: "mdx",
      development: false,
    });

    // Log the compiled output for debugging
    console.log("Compiled MDX:", String(compiled));

    // Respond with the compiled code
    res.json({ code: String(compiled) });
  } catch (error) {
    console.error("MDX Compilation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
