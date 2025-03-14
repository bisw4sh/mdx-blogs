import { defineConfig } from "vitest/config";
import { rootDir } from "./utils/getPath.util.js";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    reporters: ["json", "verbose"],
    outputFile: "./test-report.json",
  },
  resolve: {
    alias: {
      "@": rootDir, // Set "@" to point to your project root
    },
  },
});
