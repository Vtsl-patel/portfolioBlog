# Architecture

A single-page personal portfolio built with the Next.js App Router. Content lives in a typed TypeScript file today and is designed to be swapped for an API later without touching the UI.

This document explains **how the code is organised and why**. For commands and working rules, see [AGENTS.md](AGENTS.md).

## 1. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config`) |
| Theming | `next-themes` (class strategy) + CSS variable design tokens |
| Icons | `lucide-react` + custom brand SVGs (`ui/Icons.tsx`) |
| Fonts | Geist / Geist Mono via `next/font/google` (self-hosted at build time) |
| Tooling | npm, ESLint (flat config), `tsc --noEmit` |
| Testing | Vitest + React Testing Library (jsdom) for units/components; Playwright for end-to-end |
| Hosting target | Vercel |

## 2. Repository map

```
src/
  app/
    layout.tsx            Root layout: fonts, metadata, theme provider, skip link, Starfield
    page.tsx              The only page: JSON-LD + Navbar + sections (from the registry) + Footer
    globals.css           Tailwind import, design tokens, orrery + section-number CSS
    robots.ts sitemap.ts  Generated from config/site.ts (non-production = noindex)
    opengraph-image.tsx   Generated social card (twitter-image.tsx re-exports it)
    not-found.tsx
  config/site.ts          Site constants: URL resolution, indexable flag, resume path (no React)
  content/portfolio.ts    ALL portfolio content (typed). The only file to edit for copy changes
  types/portfolio.ts      Content contracts shared by content, data layer and UI
  lib/
    data/portfolio.ts     Data Access Layer: the only module that knows where content comes from
    seo/json-ld.ts        schema.org builders (Person + WebSite)
    utils/cn.ts           Class-name joiner
  components/
    layout/               Navbar (server) + NavLinks (client: scrollspy, mobile menu), Footer (server)
    sections/             One component per section + registry.tsx (+ CopyEmailButton, a client island)
    ui/                   primitives.tsx, Icon.tsx, Icons.tsx, RichText.tsx, BulletList.tsx,
                          Orrery.tsx, CodeConstellation.tsx, Starfield.tsx (client), ThemeToggle.tsx (client)
    theme-provider.tsx    Thin client wrapper around next-themes
public/resume.pdf         Served by the "Resume" buttons (replace the file to update it)
e2e/                      Playwright end-to-end specs + helpers (run against the production build)
vitest.config.ts          Unit-test config (jsdom, alias); vitest.setup.ts = shared setup
playwright.config.ts      E2E config (builds + serves the app on its own port)
.github/workflows/ci.yml  CI: typecheck, lint, audit, unit, build, e2e
```

Unit/component tests are co-located with the code (`Foo.tsx` + `Foo.test.tsx`); shared test doubles live in `src/test/helpers.ts`.

## 3. Data flow

```
content/portfolio.ts  ->  lib/data/portfolio.ts  ->  app/page.tsx  ->  sections/registry.tsx  ->  section components
   (typed data)            getPortfolioData()         (server)           (adapts data to props)      (presentational)
```

- **Components never import `content/` directly.** They receive typed props. This is the seam that lets the content source change (for example to a REST API with `fetch` and `revalidate`/tags) by editing one function body.
- `getPortfolioData` is wrapped in React `cache`, so the page, metadata, OG image and JSON-LD can share one read per render.
- Content is plain data. Presentation hints are semantic keys (`IconKey`), never React components.
- Rich text fields (`RichString`) support `**bold**` and `` `code` ``. `RichText` turns them into React elements. There is no `dangerouslySetInnerHTML` path for content.

## 4. Rendering model

Server-first. Everything is a Server Component and the page is statically generated, except these small client islands:

| Island | Why it needs the client |
|---|---|
| `ThemeProvider`, `ThemeToggle` | Reads/sets the theme |
| `layout/NavLinks.tsx` (`DesktopNav`, `MobileMenu`, `useActiveSection`) | Scrollspy via IntersectionObserver, drawer state, Escape handling |
| `sections/CopyEmailButton.tsx` | Clipboard API |
| `ui/Starfield.tsx` | Canvas animation, pointer/scroll listeners |

If you need interactivity, make the smallest possible client component and keep its parent on the server.

## 5. Section system

`sections/registry.tsx` is an ordered list of `{ id, navLabel?, visible?, zigzag?, render(data, align) }`.

- The page renders `resolveSections(data)`; the navbar items come from the same list, so order, visibility and nav stay in sync.
- Sections built on the `<Section>` primitive set `zigzag: true`. `resolveSections` alternates their `align` (left, right, left, ...) in registry order, ignoring hidden sections and the hero.
- `<Section>` (in `ui/primitives.tsx`) owns spacing, the top border, the muted/default tone, the numbered eyebrow (a CSS counter, not data), and the layout:
  - below `lg`: header stacked above content;
  - `lg+`: a sticky title rail beside the content, on the left or right depending on `align`. DOM order is always header then content, only grid placement changes.
- The hero is not a `<Section>` and has anchor id `top`.

## 6. Design system

- **Tokens:** semantic CSS variables at the top of `globals.css` (`--bg`, `--surface`, `--line`, `--fg*`, `--brand*`, `--star`, ...) are exposed to Tailwind with `@theme inline`. Components use utilities such as `bg-surface`, `text-fg-muted`, `border-line`, `text-brand-text`. **No per-element `dark:` variants.** Re-theming means editing the `:root` / `.dark` blocks.
- **Dark variant:** `@custom-variant dark (&:where(.dark, .dark *))`, with `next-themes` toggling the `dark` class on `<html>`. Default theme is the system preference.
- **Primitives (`ui/primitives.tsx`):** `Container` (`max-w-7xl`), `Section`, `Card`, `Chip`/`ChipList`, `IconBadge`, `LinkButton` (variants `primary|secondary|ghost`, sizes `sm|md`), `IconLink`.
- **Icons:** `ui/Icon.tsx` maps an `IconKey` to a component. To add an icon: extend `IconKey` in `types/portfolio.ts` and register it in `Icon.tsx`.
- **Responsive rules that matter:**
  - Navbar uses the full desktop layout from `lg`; below that, a compact menu.
  - Hero is two columns from `lg`; its CTA buttons form a 2x2 grid below `md` and one row from `md`.
  - The hero heading size scales with its own column (`@container` + `clamp(..., cqw, ...)`) so it stays on one line.
  - Below `lg` the constellation is a dimmed, cropped backdrop behind the hero text instead of a column.
  - `html { scroll-padding-top: 5rem }` keeps anchored sections clear of the sticky header.

## 7. Background and hero visuals

- **`Starfield`**: a fixed canvas (`-z-10`) with twinkle, upward drift, mouse and scroll parallax, cursor "constellations", and occasional shooting stars (dark theme only). It reads the `--star` token, follows theme changes, pauses on hidden tabs, and draws a single static frame under `prefers-reduced-motion`. Muted section tones are translucent so stars show through.
- **`CodeConstellation`** (hero): an SVG star chart where each labelled star is a technology from `profile.constellation`, linked like a dependency graph (hub plus ring). Server component; twinkle and edge flow are CSS and stop under reduced motion. Below `lg` it is a dimmed backdrop behind the hero text.
- **`Orrery`** (contact backdrop, via `Section`'s `backdrop` prop): a CSS-only solar system (no JS). Sizes use container-query units; hover pauses orbits; reduced motion renders it static.

## 8. SEO

- `config/site.ts` resolves the site URL: `NEXT_PUBLIC_SITE_URL` if set, else Vercel's `VERCEL_PROJECT_PRODUCTION_URL` (production) or `VERCEL_URL` (previews), else `http://localhost:3000`.
- That URL drives `metadataBase`, canonical, `sitemap.xml`, `robots.txt`, Open Graph/Twitter images and JSON-LD.
- `siteConfig.indexable` is true only for the real production deployment. Anything else gets `noindex, nofollow` (metadata) and `Disallow: /` (robots).
- Structured data: a `Person` + `WebSite` JSON-LD graph. Phone and email are deliberately not included.
- One `h1` (hero); each section is a landmark labelled by its `h2`.

## 9. Security and deployment

- `next.config.ts` sets CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, COOP and `Permissions-Policy`; it also disables `X-Powered-By` and production source maps.
- The CSP deliberately has **no nonces** so pages remain static and CDN-cacheable; the cost is `'unsafe-inline'` for scripts and styles (needed by Next's hydration scripts and the theme script). Everything else is locked to same-origin. **Any new third-party script, embed, font host or analytics needs an explicit CSP update.**
- No secrets are used. The only env vars are `NEXT_PUBLIC_SITE_URL` and the optional `GOOGLE_SITE_VERIFICATION` (see `.env.example`).
- On Vercel, Deployment Protection must be off for Production or visitors hit a login wall.

## 10. Decisions and gotchas

- **`--webpack` in `dev`/`build`:** pinned because Turbopack previously failed on this project's Windows setup. Keep it unless you verify Turbopack works.
- **Tailwind v4 has no config file.** Theme lives in CSS (`@theme inline`) and PostCSS uses `@tailwindcss/postcss`. A missing `postcss.config.mjs` produces zero utility classes.
- **Brand icons are custom SVGs** (`ui/Icons.tsx`) because `lucide-react` does not ship them. They are `aria-hidden`; the surrounding link provides the accessible name.
- **Hydration:** `suppressHydrationWarning` is on `<html>` only (next-themes sets the class before hydration). `ThemeToggle` uses `useSyncExternalStore` to detect mount without an effect-set-state.
- **Experience and project text must stay faithful to the resume.** Do not invent or inflate metrics.
- **Footer year** uses `new Date().getFullYear()` in a Server Component, so it is fixed at build time.

## 11. Testing

Two layers, each answering a different question.

**Unit and component (Vitest + Testing Library, jsdom): "is each piece correct?"**
- Logic: site URL/indexing resolution (every Vercel/NODE_ENV combination), `robots`, JSON-LD building/escaping, the section registry and zig-zag assignment, `RichText` parsing.
- Behaviour: hero links and resume download, scrollspy and the mobile menu (open, close, Escape and focus return), the copy-email button (clipboard, confirmation, timer).
- Only functional behaviour is tested: no styling, markup-shape, accessibility-audit, SEO-tag or security-header tests. There is no coverage gate.

**End-to-end (Playwright, Chromium): "does the shipped site work?"**
- Runs against `next build` + `next start` on its own port, so it exercises real static HTML, security headers, the CSP and fonts.
- Specs: `home` (clean load, sections, projects, links, hero buttons, resume download, copy email, 404), `navigation` (nav links, scrollspy, skip link, mobile drawer), `theme` (toggle, persistence).
- CI (`.github/workflows/ci.yml`) runs both layers plus typecheck, lint, `npm audit` and the build.

## 12. Extending

| Task | Where |
|---|---|
| Change copy, projects, skills | `content/portfolio.ts` (use `**bold**` / `` `code` `` in highlights) |
| Add a content field | `types/portfolio.ts`, then `content/portfolio.ts`, then the section that renders it |
| Add a section | New component using `<Section>`; add an entry (with `zigzag: true`) to `sections/registry.tsx` |
| Hide a section | `visible: false` in the registry |
| Change colours or theme | Tokens at the top of `globals.css` |
| Swap content to an API | Replace the body of `loadPortfolio` in `lib/data/portfolio.ts` |
| Update the resume download | Replace `public/resume.pdf` |
| Add or change behaviour | Write/adjust the co-located `*.test.tsx` first; add an `e2e/` spec for anything user-visible |
