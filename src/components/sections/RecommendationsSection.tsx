import { Card, Section, type SectionAlign } from "@/components/ui/primitives";
import type { RecommendationItem } from "@/types/portfolio";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export function RecommendationsSection({
  recommendations,
  align
}: {
  recommendations: RecommendationItem[];
  align?: SectionAlign;
}) {
  return (
    <Section
      id="recommendations"
      align={align}
      eyebrow="Testimonials"
      title="What Colleagues Say"
      description="What colleagues say about working with me, from LinkedIn."
    >
      <div className="space-y-6">
        {recommendations.map((item) => (
          <Card key={item.id} as="figure" className="p-6 sm:p-8">
            <blockquote className="space-y-4 text-base leading-relaxed text-fg-muted">
              {item.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-line-subtle pt-5">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-text"
              >
                {initials(item.name)}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-fg">{item.name}</span>
                <span className="block text-sm text-fg-muted">{item.headline}</span>
                <span className="block text-xs text-fg-subtle">
                  {item.relationship} · {formatDate(item.date)}
                </span>
              </span>
            </figcaption>
          </Card>
        ))}
      </div>
    </Section>
  );
}
