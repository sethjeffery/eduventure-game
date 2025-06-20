import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

/**
 * Markdown renderer component using react-markdown
 * Supports all standard markdown features with custom styling
 */
export function MarkdownRenderer({
  children,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          blockquote: ({ children }) => (
            <blockquote className="mb-4">{children}</blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>, // Proper paragraphs with spacing
          br: () => <br />,
          // List styling
          ul: ({ children }) => <ul className="mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 space-y-1">{children}</ol>,
          li: ({ children }) => (
            <li className="leading-relaxed marker:hidden before:content-[''] before:float-left before:align-top before:mt-2 before:rounded-full before:bg-purple-600 before:text-white before:mr-2 before:w-3 before:h-3">
              {children}
            </li>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
