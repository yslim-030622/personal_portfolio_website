# Yeongseok Lim Portfolio

Production Next.js portfolio for Yeongseok Lim. English is served at `/` and Korean is served at `/ko`.

## Stack

- Next.js 15 App Router with TypeScript strict mode
- Tailwind CSS v4 with CSS variable theme tokens
- `next-intl` for locale routing and UI microcopy
- Motion for component animation
- Lenis for smooth scrolling on non-touch and non-reduced-motion devices
- Pretendard `1.3.9` loaded locally for Korean body text

## Development

```sh
npm install
npm run dev
```

Build and checks:

```sh
npm run build
npm run typecheck
npm run lint
npm run audit:content
```

## Content Editing

Portfolio copy lives in `content/*.ts`. Each file stores English and Korean values together, and `content/index.ts` exposes `getPortfolioContent(locale)` so components receive only the localized strings they need.

Use these files to edit copy:

- `content/hero.ts` for section labels and hero links
- `content/work.ts` for selected work entries
- `content/projects.ts` for projects
- `content/notes.ts` for notes
- `content/skills.ts` for tools prose
- `content/meta.ts` for footer, SEO, and person metadata

Shared UI labels and ARIA text live in `messages/en.json` and `messages/ko.json`.

After changing Korean copy, regenerate the Pretendard subset so every Hangul glyph used by the site is included:

```sh
npm run subset:fonts
```

## Add A Project

Add a `status: "filled"` entry to `content/projects.ts` with a `title`, `kindDate`, bilingual `description`, and `tech`. The `links` field is optional. Links may omit `href` and the UI will render them as inert text instead of broken anchors.

## Add A Note

Add an item to `content/notes.ts` with a bilingual `title`, a `date`, a `tag`, and a bilingual `body`. Keep each localized body under 600 characters.

## Theme And SEO

Light mode is the default. The theme is set via `data-theme` on the `<html>` element.

Set the production URL before the final SEO review:

```sh
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example npm run build
```

Local development falls back to `http://localhost:3000`.

## Font Provenance

Pretendard is pinned as npm package `pretendard@1.3.9`, license `OFL-1.1`, tarball `https://registry.npmjs.org/pretendard/-/pretendard-1.3.9.tgz`.

`src/app/fonts/PretendardVariable.woff2` is copied from `node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2`. The build uses the generated subset `src/app/fonts/PretendardPortfolio.woff2` to keep the Korean route fast.
