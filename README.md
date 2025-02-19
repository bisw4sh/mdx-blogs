# Blog website with mdx

## Getting Started

1. Install dependencies:

  ```sh
  pnpm install
  ```

2. Start the development server:

  ```sh
  pnpm dev
  ```


# Understanding the use of mdx with toolset

1. We need to configure `@mdx-js/rollup` , this could be different for different toolset(i'm using vite; which uses **rollup for production build**).

```ts
//vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";

export default defineConfig(async () => {
  return {
    plugins: [react(), mdx()],
  };
});
```

2. We need the provider of MDX to wrap the app to apply the imported `*.mdx`

```ts
//App.ts
import { MDXProvider } from "@mdx-js/react";

function App() {
  return (
    <>
      <MDXProvider>
        <TestMarkdown />
      </MDXProvider>
    </>
  );
}

export default App;
```

**_Note: This doesnot support code higlighting and table; we need rehype-highlight, remark-gfm respectively for that_**

3. Add `remark-gfm`, (Github flavored markdown) .

```ts
//vite.config.ts
import remarkGfm from "remark-gfm";

export default defineConfig(async () => {
  return {
    plugins: [
      react(),
      mdx({
        remarkPlugins: [remarkGfm],
      }),
    ],
  };
});
```

4. Now to add code block syntax highlighting, we need rehype [guide](https://mdxjs.com/guides/syntax-highlighting/).
