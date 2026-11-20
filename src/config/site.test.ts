import { beforeEach, describe, expect, it, vi } from "vitest";

const ENV_KEYS = ["NEXT_PUBLIC_SITE_URL", "VERCEL_ENV", "VERCEL_URL", "VERCEL_PROJECT_PRODUCTION_URL", "NODE_ENV"] as const;

/** Load a fresh copy of the module with exactly the given env (others unset). */
async function loadSite(env: Partial<Record<(typeof ENV_KEYS)[number], string>> = {}) {
  vi.resetModules();
  for (const key of ENV_KEYS) vi.stubEnv(key, env[key] ?? "");
  return import("./site");
}

beforeEach(() => {
  vi.resetModules();
});

describe("site URL resolution", () => {
  it("falls back to localhost when nothing is configured", async () => {
    expect((await loadSite()).siteConfig.url).toBe("http://localhost:3000");
  });

  it("prefers NEXT_PUBLIC_SITE_URL and strips trailing slashes", async () => {
    const { siteConfig } = await loadSite({
      NEXT_PUBLIC_SITE_URL: " https://me.example/// ",
      VERCEL_ENV: "production",
      VERCEL_PROJECT_PRODUCTION_URL: "vercel-prod.example"
    });
    expect(siteConfig.url).toBe("https://me.example");
  });

  it("uses the production URL on production and the deployment URL on previews", async () => {
    const prod = await loadSite({
      VERCEL_ENV: "production",
      VERCEL_PROJECT_PRODUCTION_URL: "my-site.vercel.app",
      VERCEL_URL: "my-site-abc123.vercel.app"
    });
    expect(prod.siteConfig.url).toBe("https://my-site.vercel.app");

    const preview = await loadSite({
      VERCEL_ENV: "preview",
      VERCEL_PROJECT_PRODUCTION_URL: "my-site.vercel.app",
      VERCEL_URL: "my-site-git-x.vercel.app"
    });
    expect(preview.siteConfig.url).toBe("https://my-site-git-x.vercel.app");
  });
});

describe("indexable (only real production may be indexed)", () => {
  it("is true only for production", async () => {
    expect((await loadSite({ VERCEL_ENV: "production" })).siteConfig.indexable).toBe(true);
    expect((await loadSite({ NODE_ENV: "production" })).siteConfig.indexable).toBe(true);
    expect((await loadSite({ VERCEL_ENV: "preview" })).siteConfig.indexable).toBe(false);
    expect((await loadSite({ NODE_ENV: "development" })).siteConfig.indexable).toBe(false);
  });

  it("lets Vercel's environment win over NODE_ENV (a preview is never indexable)", async () => {
    expect((await loadSite({ VERCEL_ENV: "preview", NODE_ENV: "production" })).siteConfig.indexable).toBe(false);
  });
});

describe("absoluteUrl", () => {
  it("joins the origin and a path, adding a missing slash", async () => {
    const { absoluteUrl } = await loadSite({ NEXT_PUBLIC_SITE_URL: "https://me.example" });
    expect(absoluteUrl("/sitemap.xml")).toBe("https://me.example/sitemap.xml");
    expect(absoluteUrl("resume.pdf")).toBe("https://me.example/resume.pdf");
  });
});
