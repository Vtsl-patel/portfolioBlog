import type { Page } from "@playwright/test";

/** Standard viewports used across specs. */
export const PHONE = { width: 390, height: 844 };
export const DESKTOP = { width: 1440, height: 900 };

export const OWNER = {
  name: "Vatsal Patel",
  email: "work.vatsal.patel@gmail.com",
  oldEmail: "patelvatsal257@gmail.com",
  oldPhoneDigits: "9408393480"
};

/** Collect console errors, page errors, failed or 4xx/5xx requests and CSP violations. Call before navigating. */
export async function trackProblems(page: Page): Promise<string[]> {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console.error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
  page.on("requestfailed", (req) => problems.push(`requestfailed: ${req.url()} (${req.failure()?.errorText})`));
  page.on("response", (res) => {
    if (res.status() >= 400) problems.push(`HTTP ${res.status()}: ${res.url()}`);
  });
  await page.addInitScript(() => {
    window.addEventListener("securitypolicyviolation", (e) => {
      console.error(`CSP violation: ${e.violatedDirective} blocked ${e.blockedURI}`);
    });
  });
  return problems;
}

/** Jump instantly (no smooth scrolling) so tests don't wait on animations. */
export async function scrollToY(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
}

export async function scrollToBottom(page: Page) {
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
}

/** Scroll through the whole page in steps so lazy/observer-driven code runs. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const height = document.documentElement.scrollHeight;
    for (let y = 0; y < height; y += 500) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

/** True when the document is wider than the viewport (horizontal scroll). */
export async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
}
