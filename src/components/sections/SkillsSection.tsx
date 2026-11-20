import { Card, ChipList, IconBadge, Section, type SectionAlign } from "@/components/ui/primitives";
import type { SkillGroup } from "@/types/portfolio";

export function SkillsSection({ skills, align }: { skills: SkillGroup[]; align?: SectionAlign }) {
  return (
    <Section
      id="skills"
      align={align}
      eyebrow="Technical Stack"
      title="Skills & Technologies"
      description="Tools and technologies I use to build scalable web applications."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {skills.map((group) => (
          <Card key={group.category} className="p-6">
            <div className="flex items-center gap-3">
              <IconBadge name={group.icon} />
              <h3 className="text-base font-bold text-fg">{group.category}</h3>
            </div>
            <div className="mt-4">
              <ChipList items={group.skills} label={`${group.category} skills`} />
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
