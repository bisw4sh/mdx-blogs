import { MDXProvider } from "@mdx-js/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierCaveDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useSearchParams } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";

const posts = import.meta.glob("../markdowns/*.mdx");

const postLinks = Object.entries(posts).map(([path, importer]) => {
  const fileName = path.split("/").pop()?.replace(".mdx", "");
  return { name: fileName || "", path: `/blog/${fileName}`, importer };
});

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
}

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
  const [fetchedPost, setFetchedPost] = useState<{
    code: string;
    frontmatter?: Record<string, string>;
  } | null>(null);
  const blogSlug = searchParams.get("blogs");

  // Fetch list of available posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        if (data.posts && Array.isArray(data.posts)) {
          setApiPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching the posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const MDXContent = useMemo(() => {
    if (fetchedPost?.code) {
      try {
        // This evaluates the code and returns a React component
        return getMDXComponent(fetchedPost.code);
      } catch (error) {
        console.error("Error creating MDX component:", error);
        return null;
      }
    }
    return null;
  }, [fetchedPost]);

  // Fetch individual post content when needed
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${blogSlug}`);
        const data = await response.json();
        setFetchedPost(data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
    };

    if (
      blogSlug &&
      !postLinks.some((post) => post.name === blogSlug) &&
      apiPosts.includes(blogSlug)
    ) {
      fetchPost();
    }
  }, [blogSlug, apiPosts]);

  const allPosts = [
    ...postLinks,
    ...apiPosts.map((name) => ({
      name,
      path: `/blog/${name}`,
      importer: null,
    })),
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

      <MDXProvider components={{ code: CodeBlock }}>
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`skeleton-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: right way
                    index
                  }`}
                  className="skeleton h-4 w-full"
                />
              ))}
            </div>
          }
        >
          {BlogComponent ? (
            <BlogComponent components={{ code: CodeBlock }} />
          ) : MDXContent ? (
            <MDXContent components={{ code: CodeBlock }} />
          ) : null}
        </Suspense>
      </MDXProvider>
    </div>
  );
};

export default Template;
