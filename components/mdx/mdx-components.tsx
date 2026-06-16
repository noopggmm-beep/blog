import { CodeBlock } from "./code-block";
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  pre: ({ children }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const childProps = (children as any)?.props;
    const language = childProps?.["data-language"] || "";
    return <CodeBlock data-language={language}>{children}</CodeBlock>;
  },
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      className="rounded-lg my-6 max-w-full h-auto border border-[var(--border)]"
      loading="lazy"
      {...props}
    />
  ),
};
