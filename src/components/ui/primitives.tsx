import type { AnchorHTMLAttributes, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/Icon";
import type { IconKey } from "@/types/portfolio";

// Container

export function Container({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10", className)}>
      {children}
    </div>
  );
}

// Section

/** Which side the title rail sits on at lg+. Sections alternate for a zig-zag rhythm. */
export type SectionAlign = "left" | "right";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "default" | "muted";
  align?: SectionAlign;
  /** Decorative, non-interactive layer behind the content (clipped to the section). */
  backdrop?: ReactNode;
  children: ReactNode;
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  tone = "default",
  align = "left",
  backdrop,
  children
}: SectionProps) {
  const headingId = `${id}-heading`;
  const right = align === "right";

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "border-t border-line py-20 sm:py-28",
        !!backdrop && "relative overflow-hidden",
        tone === "muted" && "bg-surface-muted/70"
      )}
    >
      {backdrop && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {backdrop}
        </div>
      )}
      <Container className={backdrop ? "relative" : undefined}>
        {/* lg+: sticky title rail beside the content, alternating sides. DOM order stays header-first. */}
        <div
          className={cn(
            "grid gap-10 lg:gap-14 xl:gap-20",
            right
              ? "lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_20rem]"
              : "lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]"
          )}
        >
          <header
            className={cn(
              "lg:sticky lg:top-24 lg:self-start",
              right && "lg:col-start-2 lg:row-start-1 lg:text-right"
            )}
          >
            <p
              className={cn(
                "flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand-text",
                right && "lg:flex-row-reverse"
              )}
            >
              <span aria-hidden="true" className="section-index" />
              <span aria-hidden="true" className="h-px w-6 bg-brand-text/50" />
              <span>{eyebrow}</span>
            </p>
            <h2
              id={headingId}
              className="mt-3 break-words text-3xl font-extrabold tracking-tight text-fg sm:text-4xl"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-3 text-base leading-relaxed text-fg-muted">{description}</p>
            )}
          </header>
          <div className={cn("min-w-0 space-y-8", right && "lg:col-start-1 lg:row-start-1")}>
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}

// Card / Chip / IconBadge / Bullets

export function Card<T extends ElementType = "div">({
  as,
  className,
  children
}: {
  as?: T;
  className?: string;
  children: ReactNode;
}) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag className={cn("rounded-2xl border border-line bg-surface/85 shadow-xs transition-colors hover:border-brand/40", className)}>
      {children}
    </Tag>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-line bg-surface-muted px-2.5 py-1 text-xs font-medium text-fg-muted",
        className
      )}
    >
      {children}
    </span>
  );
}

export function ChipList({ items, label }: { items: string[]; label?: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}

export function IconBadge({
  name,
  size = "md"
}: {
  name: IconKey;
  size?: "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-text",
        size === "lg" ? "h-11 w-11" : "h-9 w-9"
      )}
    >
      <Icon name={name} className={size === "lg" ? "h-5 w-5" : "h-4.5 w-4.5"} />
    </span>
  );
}

// LinkButton

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-hover",
  secondary: "border border-line bg-surface text-fg hover:bg-surface-muted",
  ghost: "text-fg-muted hover:text-fg"
};

const sizeClasses: Record<Size, string> = {
  sm: "rounded-lg py-1.5 text-xs font-medium",
  md: "rounded-xl py-3 text-sm font-semibold max-[359px]:text-xs"
};

interface LinkButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: Variant;
  size?: Size;
  /** Opens in a new tab with safe rel attributes. */
  external?: boolean;
}

export function LinkButton({
  href,
  variant = "secondary",
  size = "md",
  external,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors",
        variantClasses[variant],
        sizeClasses[size],
        // Horizontal padding: compact for small/ghost buttons, roomier for full buttons.
        size === "sm" || variant === "ghost"
          ? "px-3"
          : "px-2 min-[360px]:px-4 md:px-5 lg:px-4 xl:px-5",
        className
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

// IconLink

export function IconLink({
  href,
  label,
  icon,
  external = true,
  className
}: {
  href: string;
  label: string;
  icon: IconKey;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg",
        className
      )}
    >
      <Icon name={icon} className="h-4 w-4" />
    </a>
  );
}
