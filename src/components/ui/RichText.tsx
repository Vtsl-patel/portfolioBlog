import { Fragment, type ReactNode } from "react";

/**
 * Renders `**bold**` (may contain `code`) and `code` as React elements.
 * Never uses dangerouslySetInnerHTML, so content cannot inject HTML.
 */
const BOLD_OR_CODE = /(\*\*.+?\*\*|`.+?`)/g;
const CODE = /(`.+?`)/g;

const isCode = (part: string) => part.length > 2 && part.startsWith("`") && part.endsWith("`");
const isBold = (part: string) => part.length > 4 && part.startsWith("**") && part.endsWith("**");

function renderCode(text: string): ReactNode[] {
  // One capture group: split() keeps the delimiters.
  return text.split(CODE).map((part, i) =>
    isCode(part) ? (
      <code
        key={i}
        className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(BOLD_OR_CODE).map((part, i) => {
        if (isBold(part)) {
          return (
            <strong key={i} className="font-semibold text-fg">
              {renderCode(part.slice(2, -2))}
            </strong>
          );
        }
        if (isCode(part)) return <Fragment key={i}>{renderCode(part)}</Fragment>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
