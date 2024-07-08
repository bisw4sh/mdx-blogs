import { MDXProvider } from "@mdx-js/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierCaveDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Presentation from "../markdowns/2.3.mdx";
import { snippet } from "../data/data";

const CodeBlock = ({ className, ...properties }) => {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <SyntaxHighlighter language={match[1]} PreTag="div" {...properties} />
  ) : (
    <code className={className} {...properties} />
  );
};

const Template = () => {
  const components = {
    code: CodeBlock,
  };

  return (
    <div className="flex flex-col justify-start items-start space-y-3 isolate-tailwind prose  prose-a:text-blue-600 prose-lg max-w-none lg:w-2/3 ">
      <MDXProvider components={components}>
        <Presentation />
      </MDXProvider>
      <SyntaxHighlighter
        language="javascript"
        style={atelierCaveDark}
        showLineNumbers
      >
        {snippet}
      </SyntaxHighlighter>
    </div>
  );
};

export default Template;
