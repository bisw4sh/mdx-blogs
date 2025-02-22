import express from "express";
import path from "node:path";
import url from "node:url";
import { save_mdx } from "./controllers/save-mdx";
import postRoutes from "./routes/posts.route";
import "dotenv/config";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "./public")));

app.post("/api/save-mdx", save_mdx);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
