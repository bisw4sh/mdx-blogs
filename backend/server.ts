import express from "express";
import "dotenv/config";
import { save_mdx } from "./controllers/save-mdx";

// Create Express App
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example Route
app.post("/api/save-mdx", save_mdx);

// Start Server
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
