import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const CodeBlock = ({ code }) => {
  return (
    <SyntaxHighlighter
      language="typescript"
      customStyle={{
        margin: 0,
        padding: "2rem",
        height: "100%",
        borderRadius: "20px 0 0 20px",
        background: "rgba(30,41,59,1)",
        backdropFilter: "blur(10px)",
      }}
      style={vscDarkPlus}
    >
      {code}
    </SyntaxHighlighter>
  );
};
