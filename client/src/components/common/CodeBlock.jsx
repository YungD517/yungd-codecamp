import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./CodeBlock.css";

export default function CodeBlock({ title, code, language = "javascript" }) {
  return (
    <div className="code-block">
      {title && <div className="code-block__header">{title}</div>}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "20px",
          background: "#1a1e25",
          borderRadius: title ? "0 0 6px 6px" : "6px",
          fontSize: "0.8375rem",
          lineHeight: "1.65",
        }}
        showLineNumbers
        lineNumberStyle={{ color: "#3a4049", fontSize: "0.75rem" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
