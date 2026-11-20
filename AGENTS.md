<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working on this repo

A single-page personal portfolio (Next.js App Router, TypeScript, Tailwind v4). **Read [ARCHITECTURE.md](ARCHITECTURE.md) first**; it explains the structure, data flow and the reasons behind non-obvious choices.

## Commands

```bash
npm run dev         # dev server (webpack; do not remove the --webpack flag)
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # production build (also type-checks)
npm test            # unit + component tests (Vitest, jsdom)
npm run test:e2e    # Playwright against a production build (own port, 3100)
npm audit           # run before deploying
```

Before reporting work as done, run `typecheck`, `lint`, `test` and `build` (and `test:e2e` for anything visual, routing, SEO or a11y related), and say what you actually ran. For visual or layout changes, look at the result (desktop and a ~390px mobile viewport, dark and light) instead of assuming it works.

## Rules

**Content**
- All copy lives in `src/content/portfolio.ts`. Keep it faithful to the owner's resume; never invent, inflate or "improve" claims, metrics or dates without being asked.
- Components must not import from `src/content/`. Data flows content, then `lib/data/portfolio.ts`, then page and registry, then props.
- Do not put personal data (phone number, home address, private paths) into content, JSON-LD, metadata or docs.

**UI**
- Server Components by default. Add `"use client"` only to the smallest component that needs it.
- Use the design tokens (`bg-surface`, `text-fg-muted`, `border-line`, `text-brand-text`, ...) and the primitives in `ui/primitives.tsx`. Do not add per-element `dark:` colour variants or one-off copies of card/button/chip styles.
- New sections use `<Section>` and are registered in `sections/registry.tsx` (`zigzag: true`). Do not hardwire them into `page.tsx`.
- Icons are referenced by `IconKey` and registered in `ui/Icon.tsx`.
- Keep accessibility intact: semantic headings (one `h1`), accessible names on icon-only controls, visible focus, `prefers-reduced-motion` respected for any new animation, no horizontal scroll at any width (check 320px).

**Security and deployment**
- A strict CSP is set in `next.config.ts`. Adding any third-party script, embed, font host or analytics requires a deliberate CSP change; do not loosen it to make something work.
- Never use `dangerouslySetInnerHTML` for content. The only exception is the JSON-LD script, which is serialised with `<` escaped.
- Never commit secrets or real `.env` files. `.env.example` holds placeholders only.
- Production is the only indexable environment; do not change that logic casually.

**Testing**
- Every behaviour change ships with tests. Unit/component tests are co-located (`Foo.tsx` next to `Foo.test.tsx`); end-to-end specs live in `e2e/`. A bug fix starts with a test that fails.
- Query by accessible role/name (Testing Library, Playwright `getByRole`), not by class or test id. If a role query is awkward, the markup is probably wrong.
- E2E runs the real production build and covers user-facing behaviour only (navigation, hero buttons, resume download, copy email, theme toggle, 404). Do not delete tests to get green; fix the cause.

**Environment gotchas**
- **Windows + Git Bash:** Vitest fails ("Vitest failed to find the current suite") when the working directory has a lowercase drive letter (`d:\...`). Run tests from PowerShell/CMD (`D:\...`) or VS Code's default terminal.
- **Installing/upgrading Vitest packages:** npm 10 crashes (`edgesOut` error) resolving Vitest's circular optional peers. Install them once with `npm install --save-exact --legacy-peer-deps <pkg>`; a plain `npm ci` / `npm install` works afterwards. Keep `vite`, `jsdom` and `@types/node` (22.x) as explicit devDependencies, and `playwright-core` pinned to Playwright's version.
- **E2E setup:** run `npx playwright install chromium` once (or `PW_CHANNEL=msedge npm run test:e2e` to use an installed Edge). Set `E2E_PORT` if 3100 is taken. Locally an already-running server on that port is reused.

**Process**
- Do not add dependencies without a clear need; prefer what exists. Pin versions like the rest of `package.json`.
- Do not commit, push or change git history unless explicitly asked.
- Do not create extra docs, notes, journals or planning files in the repo. The only documentation files are `README.md`, `ARCHITECTURE.md` and this file. Update `ARCHITECTURE.md` when you change structure or key decisions, and keep it accurate and free of personal or local-machine details.
