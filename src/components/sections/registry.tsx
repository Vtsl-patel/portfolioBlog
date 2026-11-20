import type { ReactNode } from "react";
import { AboutSection } from "@/components/sections/AboutSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import type { SectionAlign } from "@/components/ui/primitives";
import type { PortfolioData } from "@/types/portfolio";

/**
 * Ordered section definitions drive the page (ADR-006), so order and visibility can later
 * come from the CMS. Each `render` passes a section only the props it needs.
 */
export interface SectionDefinition {
  /** Anchor id; also used by scrollspy and in-page links. */
  id: string;
  /** Label shown in navigation. Omit to keep a section out of the nav. */
  navLabel?: string;
  visible?: boolean;
  /** Built on <Section>: numbered, alternates left/right in registry order. The hero is not. */
  zigzag?: boolean;
  render: (data: PortfolioData, align: SectionAlign) => ReactNode;
}

export const sectionRegistry: SectionDefinition[] = [
  { id: "top", render: (d) => <HeroSection profile={d.profile} /> },
  {
    id: "about",
    navLabel: "About",
    zigzag: true,
    render: (d, align) => <AboutSection profile={d.profile} align={align} />
  },
  {
    id: "skills",
    navLabel: "Skills",
    zigzag: true,
    render: (d, align) => <SkillsSection skills={d.skills} align={align} />
  },
  {
    id: "experience",
    navLabel: "Experience",
    zigzag: true,
    render: (d, align) => (
      <ExperienceSection experiences={d.experiences} education={d.education} align={align} />
    )
  },
  {
    id: "projects",
    navLabel: "Projects",
    zigzag: true,
    render: (d, align) => <ProjectsSection projects={d.projects} align={align} />
  },
  {
    id: "achievements",
    navLabel: "Achievements",
    zigzag: true,
    render: (d, align) => <AchievementsSection achievements={d.achievements} align={align} />
  },
  {
    id: "contact",
    navLabel: "Contact",
    zigzag: true,
    render: (d, align) => <ContactSection profile={d.profile} align={align} />
  }
];

export interface NavItem {
  id: string;
  label: string;
}

export const navItems: NavItem[] = sectionRegistry
  .filter((s) => s.navLabel && s.visible !== false)
  .map((s) => ({ id: s.id, label: s.navLabel as string }));

/** Resolves the visible sections and assigns zig-zag alignment in order (first = left). */
export function resolveSections(data: PortfolioData): { id: string; node: ReactNode }[] {
  let n = 0;
  return sectionRegistry
    .filter((s) => s.visible !== false)
    .map((s) => {
      const align: SectionAlign = s.zigzag && n++ % 2 === 1 ? "right" : "left";
      return { id: s.id, node: s.render(data, align) };
    });
}
