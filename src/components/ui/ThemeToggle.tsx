"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const subscribe = () => () => {};

const buttonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-fg-muted shadow-2xs transition-colors hover:bg-surface-muted hover:text-fg";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // False on the server and during hydration; avoids a theme mismatch.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return <span aria-hidden="true" className={buttonClass} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={buttonClass}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
