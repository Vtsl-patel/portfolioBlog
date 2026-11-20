/**
 * Content contracts: the seam between content (local TS today, CMS later) and components.
 * Components receive these via props and never import content. `icon` fields are
 * `IconKey`s; `RichString` fields may use `**bold**` (rendered by <RichText />).
 */

export type RichString = string;

export type IconKey =
  | "github"
  | "linkedin"
  | "leetcode"
  | "codeforces"
  | "codechef"
  | "mail"
  | "users"
  | "globe"
  | "building"
  | "brain"
  | "code"
  | "layout"
  | "server"
  | "check"
  | "cpu"
  | "wrench"
  | "database"
  | "wallet"
  | "gamepad"
  | "trophy";

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: IconKey;
  /** Show in the compact hero/footer rows. */
  featured?: boolean;
}

export interface StatItem {
  label: string;
  value: string;
  icon: IconKey;
}

export interface Profile {
  name: string;
  role: string;
  company: string;
  /** Short positioning line shown under the name. */
  headline: string;
  /** One-paragraph summary for the hero. */
  summary: string;
  email: string;
  location: string;
  /** Availability line, e.g. "Open to ... roles". */
  status: string;
  education: string;
  /** Technologies shown as stars in the hero constellation (max 8, in layout order: hub first). */
  constellation: string[];
  /** Decorative quote shown under the hero visual. */
  quote?: { text: string; source: string };
  about: string[];
  stats: StatItem[];
  socials: SocialLink[];
}

export interface SkillGroup {
  category: string;
  icon: IconKey;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  /** Human-readable range shown in the UI. */
  duration: string;
  /** ISO dates power structured data and "years of experience". */
  startDate: string;
  endDate?: string;
  type: string;
  highlights: RichString[];
  technologies: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
  grade: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  icon: IconKey;
  description: string;
  highlights: RichString[];
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  icon: IconKey;
  description: string;
  links?: { label: string; url: string }[];
}

/** A public LinkedIn recommendation, quoted verbatim. */
export interface RecommendationItem {
  id: string;
  name: string;
  /** The recommender's headline at the time shown. */
  headline: string;
  /** e.g. "Worked with Vatsal on the same team". */
  relationship: string;
  /** ISO date; shown as month and year. */
  date: string;
  /** One entry per paragraph. */
  text: string[];
}

export interface PortfolioData {
  profile: Profile;
  skills: SkillGroup[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
  recommendations: RecommendationItem[];
}
