import { describe, expect, it, vi } from "vitest";

async function loadRobots(env: Record<string, string>) {
  vi.resetModules();
  for (const key of ["NEXT_PUBLIC_SITE_URL", "VERCEL_ENV", "VERCEL_URL", "VERCEL_PROJECT_PRODUCTION_URL", "NODE_ENV"]) {
    vi.stubEnv(key, env[key] ?? "");
  }
  return (await import("./robots")).default();
}

describe("robots.txt", () => {
  it("allows crawling and advertises the sitemap on production", async () => {
    const robots = await loadRobots({
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://me.example"
    });
    expect(robots.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(robots.sitemap).toBe("https://me.example/sitemap.xml");
    expect(robots.host).toBe("https://me.example/");
  });

  it("blocks all crawling on preview deployments", async () => {
    const robots = await loadRobots({
      VERCEL_ENV: "preview",
      VERCEL_URL: "x-git-branch.vercel.app"
    });
    expect(robots.rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(robots.sitemap).toBeUndefined();
  });

  it("blocks crawling in local development", async () => {
    const robots = await loadRobots({ NODE_ENV: "development" });
    expect(robots.rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("allows crawling for a non-Vercel production build", async () => {
    const robots = await loadRobots({ NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://me.example" });
    expect(robots.rules).toEqual({ userAgent: "*", allow: "/" });
  });
});
