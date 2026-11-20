import { RichText } from "@/components/ui/RichText";

export function BulletList({
  items,
  className = "space-y-4"
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={`${className} text-[15px] leading-relaxed text-fg-muted sm:text-base`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3.5">
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>
            <RichText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}
