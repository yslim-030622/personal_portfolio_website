# Yeongseok Lim — Portfolio

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

Personal portfolio site built with Next.js 15 App Router. English is served at `/` and Korean at `/ko`. All portfolio copy lives in `content/*.ts` — no CMS, no database.

## Tech Stack

| Layer | Technology | Why |
| ----- | ---------- | --- |
| Framework | Next.js 15 App Router | Static output with React Server Components |
| Language | TypeScript (strict) | Type safety across content, components, and config |
| Styling | Tailwind CSS v4 | CSS variable theme tokens with no runtime overhead |
| i18n | next-intl | Locale routing and bilingual content delivery |
| Animation | Motion | Component-level enter/exit animations |
| Scrolling | Lenis | Smooth scrolling on non-touch, non-reduced-motion devices |
| Fonts | Pretendard 1.3.9 | Korean body text, loaded locally from npm |
| Deployment | Vercel | Automatic deploys on push to main |

## Project Structure

```text
content/
├── hero.ts       # Hero section, links, section eyebrows
├── work.ts       # Work experience entries
├── projects.ts   # Project entries with tech and links
├── notes.ts      # Coursework / notes entries
├── skills.ts     # Tools prose
├── meta.ts       # Footer, SEO, and person metadata
└── index.ts      # getPortfolioContent(locale) — single entry point

src/
├── app/          # Next.js App Router pages and layouts
├── components/   # UI components
└── lib/          # Shared utilities

messages/
├── en.json       # Shared UI labels and ARIA text (English)
└── ko.json       # Shared UI labels and ARIA text (Korean)
```

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

All portfolio copy lives in `content/*.ts`. Each file stores English and Korean values together. `content/index.ts` exposes `getPortfolioContent(locale)` so components receive only the localized strings they need.

| File | What to edit |
| ---- | ------------ |
| `content/hero.ts` | Section labels, hero bio, and social links |
| `content/work.ts` | Work experience entries |
| `content/projects.ts` | Projects with tech stack and links |
| `content/notes.ts` | Coursework and notes |
| `content/skills.ts` | Tools prose |
| `content/meta.ts` | Footer, SEO metadata, and person schema |

Shared UI labels and ARIA text live in `messages/en.json` and `messages/ko.json`.

After changing Korean copy, regenerate the Pretendard subset so every Hangul glyph used by the site is included:

```sh
npm run subset:fonts
```

## Adding Content

### Add a Project

Add a `status: "filled"` entry to `content/projects.ts` with a `title`, `kindDate`, bilingual `description`, and `tech`. The `links` field is optional — links may omit `href` and the UI renders them as inert text instead of broken anchors.

### Add a Note

Add an item to `content/notes.ts` with a bilingual `title`, a `date`, a `tag`, and a bilingual `body`. Keep each localized body under 600 characters.

## SEO and Theme

Light mode is the default. The theme is set via `data-theme` on the `<html>` element.

Set the production URL before the final SEO review:

```sh
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example npm run build
```

Local development falls back to `http://localhost:3000`.

## Font Provenance

Pretendard is pinned as npm package `pretendard@1.3.9`, license `OFL-1.1`.

`src/app/fonts/PretendardVariable.woff2` is copied from `node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2`. The build uses the generated subset `src/app/fonts/PretendardPortfolio.woff2` to keep the Korean route fast.
