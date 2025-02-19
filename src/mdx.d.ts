// src/mdx.d.ts or @types/mdx.d.ts
declare module "*.mdx" {
  // biome-ignore lint/suspicious/noExplicitAny: as specified in the docs
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}
