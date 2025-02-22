import express from "express";
import path from "node:path";
import url from "node:url";
import postRoutes from "@/routes/posts.route.js";
import healthCheckRoutes from "@/routes/health-check.route.js";
import errorHandler from "@/middleware/errorHandler.middleware.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "./public")));

app.post("/api/health-check", healthCheckRoutes);
app.use("/api/posts", postRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
