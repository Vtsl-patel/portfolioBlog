# Portfolio

A fast, accessible, responsive single-page portfolio built with Next.js (App Router), TypeScript and Tailwind CSS v4. Dark theme is a night sky, light theme a faint star chart.

See [ARCHITECTURE.md](ARCHITECTURE.md) for how it is organised and why.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit and component tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright, against a production build) |
| `npm run test:e2e:watch` | Same, in a visible browser, one test at a time (add `PW_SLOWMO=500` to slow it down) |

Content lives in `src/content/portfolio.ts`; the resume download is `public/resume.pdf`.

## Testing

```bash
npm test                       # unit + component tests
npx playwright install chromium   # once, for e2e
npm run test:e2e               # builds, serves on :3100, runs Playwright
```

On Windows, run the tests from PowerShell or CMD rather than Git Bash (a lowercase drive letter breaks Vitest). See [ARCHITECTURE.md](ARCHITECTURE.md#11-testing) for what is covered.

## Deploying to Vercel

1. Import the repo (framework preset: Next.js, build command `npm run build`; Node 20.9+ is enforced via `engines`).
2. Set `NEXT_PUBLIC_SITE_URL=https://your-domain` for Production (recommended once you have a custom domain; otherwise Vercel's URL variables are used). Optional: `GOOGLE_SITE_VERIFICATION`. See `.env.example`.
3. In **Project Settings → Deployment Protection**, make sure Production is **not** protected, or visitors will hit a login wall.
4. After the first deploy, check `/robots.txt`, `/sitemap.xml` and the social-card preview (`/opengraph-image`), then submit the sitemap in Search Console.

Only the production deployment is indexable; previews are served with `noindex`.
