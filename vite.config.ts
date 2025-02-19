import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";

export default defineConfig({
  plugins: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      // rehypePlugins: [rehypePrism],
      providerImportSource: "@mdx-js/react",
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5555/api",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
  optimizeDeps: {
    include: ["react-syntax-highlighter"],
  },
});