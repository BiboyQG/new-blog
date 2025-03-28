import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { useEffect, useRef } from "react";

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

export default function MarkdownDisplay({
  content,
  className = "",
}: MarkdownDisplayProps) {
  const markdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!markdownRef.current) return;

    // Find all pre elements (code blocks)
    const codeBlocks = markdownRef.current.querySelectorAll("pre");

    // For each code block, add a copy button
    codeBlocks.forEach((codeBlock) => {
      // Create wrapper div for positioning
      const wrapper = document.createElement("div");
      wrapper.className = "relative";

      // Clone the code block
      const clonedCodeBlock = codeBlock.cloneNode(true);

      // Create copy button
      const copyButton = document.createElement("button");
      copyButton.className =
        "absolute top-2 right-2 p-1 rounded bg-gray-700 text-white transition-opacity text-xs";
      copyButton.textContent = "Copy";

      // Add click handler
      copyButton.addEventListener("click", () => {
        const code = codeBlock.textContent || "";
        navigator.clipboard.writeText(code).then(() => {
          copyButton.textContent = "Copied!";
          setTimeout(() => {
            copyButton.textContent = "Copy";
          }, 2000);
        });
      });

      // Replace code block with wrapper
      wrapper.appendChild(clonedCodeBlock);
      wrapper.appendChild(copyButton);
      codeBlock.replaceWith(wrapper);
    });
  }, [content]); // Re-run when content changes

  return (
    <div
      ref={markdownRef}
      className={`prose dark:prose-invert max-w-none ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
