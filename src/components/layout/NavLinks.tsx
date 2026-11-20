"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useActiveSection } from "@/components/layout/useActiveSection";
import type { NavItem } from "@/components/sections/registry";

const ids = (items: NavItem[]) => items.map((i) => i.id);

/** Desktop navigation with scrollspy (client island). */
export function DesktopNav({ items }: { items: NavItem[] }) {
  const active = useActiveSection(ids(items));

  return (
    <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "location" : undefined}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-muted hover:text-fg",
            active === item.id ? "text-fg" : "text-fg-muted"
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

/** Mobile toggle + drawer. Escape closes and restores focus to the toggle. */
export function MobileMenu({
  items,
  children
}: {
  items: NavItem[];
  /** Extra actions (resume, email) rendered inside the drawer by the server shell. */
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const drawerId = useId();
  const active = useActiveSection(ids(items));

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={drawerId}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted hover:bg-surface-muted hover:text-fg"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      <div
        id={drawerId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-bg px-4 pb-6 pt-2 shadow-lg"
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={close}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-base font-medium hover:bg-surface-muted hover:text-fg",
                active === item.id ? "text-fg" : "text-fg-muted"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {/* The drawer's action links close the menu when activated. */}
        <div className="mt-3 flex flex-col gap-2" onClick={close}>
          {children}
        </div>
      </div>
    </div>
  );
}
