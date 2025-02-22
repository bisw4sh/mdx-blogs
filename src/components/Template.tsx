import { MDXProvider } from "@mdx-js/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierCaveDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useSearchParams } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

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
  const [apiPosts, setApiPosts] = useState<string[]>([]);
  const [fetchedPost, setFetchedPost] = useState<string | null>(null);
  const blogSlug = searchParams.get("blogs");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && Array.isArray(data.posts)) {
          setApiPosts(data.posts);
        }
      })
      .catch((err) => console.error("Error fetching API posts:", err));
  }, []);

  useEffect(() => {
    if (blogSlug && !postLinks.some((post) => post.name === blogSlug) && !apiPosts.includes(blogSlug)) {
      fetch(`/api/posts/${blogSlug}`)
        .then((res) => res.text())
        .then((data) => setFetchedPost(data))
        .catch((err) => console.error("Error fetching blog post:", err));
    }
  }, [blogSlug, apiPosts]);

  const allPosts = [
    ...postLinks,
    ...apiPosts.map((name) => ({ name, path: `/blog/${name}`, importer: null })),
  ];

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
        {allPosts.map(({ name }) => (
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
                <div key={index} className="skeleton h-4 w-full" />
              ))}
            </div>
          }
        >
          {BlogComponent ? (
            <BlogComponent components={{ code: CodeBlock }} />
          ) : fetchedPost ? (
            <div dangerouslySetInnerHTML={{ __html: fetchedPost }} />
          ) : null}
        </Suspense>
      </MDXProvider>
    </div>
  );
};

export default Template;
