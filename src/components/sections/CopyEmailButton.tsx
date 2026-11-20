"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Only client JS in the contact section; the rest stays a Server Component. */
export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface-muted"
    >
      {copied ? (
        <Check className="h-4 w-4 text-success-text" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4 text-fg-subtle" aria-hidden="true" />
      )}
      <span className={copied ? "font-semibold text-success-text" : undefined}>
        {copied ? "Copied!" : "Copy email"}
      </span>
      {/* Announce the result to screen readers. */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
