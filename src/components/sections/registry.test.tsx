import type { ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { portfolioData } from "@/content/portfolio";
import { navItems, resolveSections, sectionRegistry } from "./registry";

const alignOf = (node: unknown) => (node as ReactElement<{ align?: string }>).props.align;
const sectionAligns = () =>
  resolveSections(portfolioData)
    .filter((s) => s.id !== "top")
    .map((s) => alignOf(s.node));

describe("section registry", () => {
  const original = new Map(sectionRegistry.map((s) => [s.id, s.visible]));
  afterEach(() => {
    for (const s of sectionRegistry) s.visible = original.get(s.id);
  });

  it("has unique ids, starts with the hero and keeps the hero out of the nav", () => {
    const ids = sectionRegistry.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe("top");
    expect(navItems.map((n) => n.id)).toEqual(ids.slice(1));
  });

  it("alternates the title rail left/right, starting left", () => {
    expect(sectionAligns()).toEqual(["left", "right", "left", "right", "left", "right", "left"]);
  });

  it("skips hidden sections and keeps the zig-zag intact", () => {
    sectionRegistry.find((s) => s.id === "skills")!.visible = false;
    expect(resolveSections(portfolioData).map((s) => s.id)).not.toContain("skills");
    expect(sectionAligns()).toEqual(["left", "right", "left", "right", "left", "right"]);
  });
});
