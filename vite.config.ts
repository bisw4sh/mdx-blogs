import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";

export default defineConfig(async () => {
  return {
    plugins: [react(), mdx()],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5555/api",
          changeOrigin: true,
          rewrite: (path : string) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
