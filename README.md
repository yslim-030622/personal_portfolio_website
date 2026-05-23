# Yeongseok Lim Portfolio

Production Next.js portfolio for Yeongseok Lim. English is served at `/`; Korean is served at `/ko`.

## Stack

- Next.js 15 App Router with TypeScript strict mode
- Tailwind CSS v4 with CSS variable theme tokens
- `next-intl` for locale routing and UI microcopy
- Motion for component animation
- Lenis for non-touch, non-reduced-motion smooth scroll
- Pretendard `1.3.9` loaded locally for Korean body text

## Development

```sh
pnpm install
pnpm dev
```

Build and checks:

```sh
pnpm build
pnpm typecheck
pnpm lint
pnpm audit:content
```

## Content Editing

Portfolio copy lives in `content/*.ts`. Raw files store English and Korean values together, then `content/index.ts` exposes `getPortfolioContent(locale)` so components receive only localized strings.

Use these files:

- `content/hero.ts` for section labels and hero links
- `content/work.ts` for selected work
- `content/projects.ts` for projects
- `content/notes.ts` for notes
- `content/skills.ts` for tools prose
- `content/meta.ts` for footer, SEO, and person metadata

Shared UI labels and ARIA text live in `messages/en.json` and `messages/ko.json`.

After changing Korean copy, regenerate the Pretendard subset so every Hangul glyph used by the site is included:

```sh
pnpm subset:fonts
```

## Add A Project

Add a `status: "filled"` entry to `content/projects.ts` with:

- `title`
- `kindDate`
- bilingual `description`
- `tech`
- optional `links`

Links may omit `href`; the UI renders them as inert text instead of broken anchors.

## Add A Note

Add an item to `content/notes.ts` with:

- bilingual `title`
- `date`
- `tag`
- bilingual `body`

Keep each localized body under 600 characters.

## Theme And SEO

Dark mode is the default and persists in `localStorage` with key `ysl-theme`.

Set the production URL before final SEO review:

```sh
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example pnpm build
```

Local development falls back to `http://localhost:3000`.

## Font Provenance

Pretendard is pinned as npm package `pretendard@1.3.9`, license `OFL-1.1`, tarball `https://registry.npmjs.org/pretendard/-/pretendard-1.3.9.tgz`.

`src/app/fonts/PretendardVariable.woff2` is copied from the installed package path `node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2`. The build uses the generated subset `src/app/fonts/PretendardPortfolio.woff2` to keep the Korean route fast.
