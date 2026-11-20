import type { ComponentType } from "react";
import {
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChefHat,
  Code,
  Cpu,
  Database,
  Gamepad2,
  Globe2,
  Layout,
  Mail,
  Server,
  Terminal,
  Trophy,
  Users,
  Wallet,
  Wrench
} from "lucide-react";
import { GithubIcon, LeetCodeIcon, LinkedinIcon } from "@/components/ui/Icons";
import type { IconKey } from "@/types/portfolio";

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>;

/** Maps semantic `IconKey`s to components, so content never imports React. */
const registry: Record<IconKey, IconComponent> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  leetcode: LeetCodeIcon,
  codeforces: Terminal,
  codechef: ChefHat,
  mail: Mail,
  users: Users,
  globe: Globe2,
  building: Building2,
  brain: BrainCircuit,
  code: Code,
  layout: Layout,
  server: Server,
  check: CheckCircle2,
  cpu: Cpu,
  wrench: Wrench,
  database: Database,
  wallet: Wallet,
  gamepad: Gamepad2,
  trophy: Trophy
};

/** Every icon key the registry can render (used by tests to validate content). */
export const iconKeys = Object.keys(registry) as IconKey[];

interface IconProps {
  name: IconKey;
  className?: string;
}

/** Decorative icon (hidden from assistive tech). */
export function Icon({ name, className = "h-4 w-4" }: IconProps) {
  const Component = registry[name] ?? Code;
  return <Component className={className} aria-hidden="true" />;
}
