import { MDXProvider } from "@mdx-js/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierCaveDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useSearchParams } from "react-router-dom";
import Presentation from "../markdowns/2.3.mdx";
// import ReactRouterIssue from "../markdowns/react-router-issue.mdx";
// import GoogleOauth from "../markdowns/google-oauth2.0.mdx";
import { lazy, Suspense } from "react";

const ReactRouterIssue = lazy(
  () => import("../markdowns/react-router-issue.mdx")
);
const GoogleOauth = lazy(() => import("../markdowns/google-oauth2.0.mdx"));

interface CodeProps {
  className?: string;
  [key: string]: any;
}

function code({ className, ...properties }: CodeProps) {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <SyntaxHighlighter
      language={match[1]}
      PreTag="div"
      {...properties}
      style={atelierCaveDark}
      showLineNumbers
    />
  ) : (
    <code className={className} {...properties} />
  );
}

const Template = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const blogs = searchParams.get("blogs");

  return (
    <div className="flex flex-col justify-start items-start space-y-3 isolate-tailwind prose  prose-a:text-blue-600 prose-lg max-w-none lg:w-2/3 ">
      <div className="space-x-4 py-4">
        <button
          className="link link-info"
          onClick={() => setSearchParams({ blogs: "googleoauth" })}
        >
          Google Oauth
        </button>
        <button
          className="link link-info"
          onClick={() => setSearchParams({ blogs: "presentation" })}
        >
          Presentation
        </button>
        <button
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
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          }
        >
          {blogs === "react-router-issue" ? (
            <ReactRouterIssue components={{ code }} />
          ) : blogs === "googleoauth" ? (
            <GoogleOauth components={{ code }} />
          ) : (
            <Presentation components={{ code }} />
          )}
        </Suspense>
      </MDXProvider>
    </div>
  );
};

export default Template;
