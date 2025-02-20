import { MDXProvider } from "@mdx-js/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierCaveDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useSearchParams } from "react-router-dom";
import { lazy, Suspense } from "react";

const posts = import.meta.glob("../markdowns/*.mdx");

const postLinks = Object.entries(posts).map(([path, importer]) => {
  const fileName = path.split("/").pop()?.replace(".mdx", "");
  return { name: fileName || "", path: `/blog/${fileName}`, importer };
});

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
}

// Custom syntax highlighting component
function CodeBlock({ className, children, ...props }: CodeProps) {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <SyntaxHighlighter
      language={match[1]}
      PreTag="div"
      {...props}
      style={atelierCaveDark}
      showLineNumbers
    >
      {String(children).trim()}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

const Template = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const blogSlug = searchParams.get("blogs");

  // Find the selected blog
  const selectedPost = postLinks.find((post) => post.name === blogSlug);
  const BlogComponent = selectedPost
    ? lazy(
        () =>
          selectedPost.importer() as Promise<{
            default: React.ComponentType<any>;
          }>
      )
    : null;

  return (
    <div className="flex flex-col justify-start items-start space-y-3 isolate-tailwind prose prose-a:text-blue-600 prose-lg max-w-none lg:w-2/3">
      <div className="space-x-4 py-4">
        {postLinks.map(({ name }) => (
          <button
            key={name}
            type="button"
            className="link link-info"
            onClick={() => setSearchParams({ blogs: name })}
          >
            {name}
          </button>
        ))}
      </div>

      <MDXProvider>
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: let it be
                <div key={index} className="skeleton h-4 w-full" />
              ))}
            </div>
          }
        >
          {BlogComponent && <BlogComponent components={{ code: CodeBlock }} />}
        </Suspense>
      </MDXProvider>
    </div>
  );
};

export default Template;
