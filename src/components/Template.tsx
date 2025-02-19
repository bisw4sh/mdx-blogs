import { MDXProvider } from "@mdx-js/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierCaveDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useSearchParams } from "react-router-dom";
import { lazy, Suspense } from "react";

import PresentationMarkdown from "../markdowns/2.3.mdx";
const ReactRouterIssue = lazy(
  () => import("../markdowns/react-router-issue.mdx")
);
const GoogleOauth = lazy(() => import("../markdowns/google-oauth2.0.mdx"));

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
}

// Custom `code` component for syntax highlighting
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
  const blogs = searchParams.get("blogs");

  return (
    <div className="flex flex-col justify-start items-start space-y-3 isolate-tailwind prose prose-a:text-blue-600 prose-lg max-w-none lg:w-2/3">
      <div className="space-x-4 py-4">
        <button
          type="button"
          className="link link-info"
          onClick={() => setSearchParams({ blogs: "googleoauth" })}
        >
          Google Oauth
        </button>
        <button
          type="button"
          className="link link-info"
          onClick={() => setSearchParams({ blogs: "presentation" })}
        >
          Presentation
        </button>
        <button
          type="button"
          className="link link-info"
          onClick={() => setSearchParams({ blogs: "react-router-issue" })}
        >
          React Router Issue
        </button>
      </div>

      <MDXProvider>
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: shouldn't use index but no other option
                <div key={index} className="skeleton h-4 w-full" />
              ))}
            </div>
          }
        >
          {blogs === "react-router-issue" ? (
            <ReactRouterIssue components={{ code: CodeBlock }} />
          ) : blogs === "googleoauth" ? (
            <GoogleOauth components={{ code: CodeBlock }} />
          ) : (
            <PresentationMarkdown components={{ code: CodeBlock }} />
          )}
        </Suspense>
      </MDXProvider>
    </div>
  );
};

export default Template;
