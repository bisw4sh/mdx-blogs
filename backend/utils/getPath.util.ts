import url from "node:url";
import path from "node:path";

// TODO : fix for the pnpm start(prod after build), need change in tsconfig to allow interOperability of esm & cjs
const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.join(path.dirname(__filename), "..");
