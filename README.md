# Aghyad Ghziel — Developer Portfolio

Personal portfolio for a full-stack developer with a frontend focus. Built for recruiters
and hiring managers: role, stack, experience, projects and contact, readable in about
thirty seconds.

Next.js 16 (App Router), React 19, TypeScript, SCSS modules and the
[Once UI](https://once-ui.com/products/magic-portfolio) design tokens. Project write-ups
are MDX.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Where things live

| What | Where |
|---|---|
| All site copy — hero, about, experience, stack, contact | `src/resources/content.tsx` |
| Theme, fonts, routes, SEO | `src/resources/once-ui.config.ts` |
| Project write-ups (one `.mdx` per project) | `src/app/work/projects/` |
| Home page sections | `src/components/sections/` |
| Motion primitives | `src/components/motion/` |
| Icons | `src/resources/icons.ts` |

Almost every content change is an edit to `content.tsx` — including the experience
entries, which drive both the home page section and the about page. Nothing in that file
is generated; if a claim is in there, it should be true.

## Page structure

The home page is one scroll: hero → about → experience → projects → stack → contact.
Navigation links to those anchors and marks the current one as you scroll. `/about` holds
the longer version, `/work` lists every project, `/work/<slug>` is a single write-up.

## Environment

Set the production origin so canonical URLs, Open Graph tags, the sitemap and schema point
at the real domain. Without it the build falls back to the Vercel deployment URL, then to
`http://localhost:3000`.

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

`PAGE_ACCESS_PASSWORD` is only needed if you add entries to `protectedRoutes` in
`once-ui.config.ts`. See `.env.example`.

## Adding a project

Create `src/app/work/projects/<slug>.mdx`. The frontmatter drives the card and the
write-up page:

```yaml
---
title: "Project name"
subtitle: "One line on what it is"
publishedAt: "2026-01-30"     # sorts the list, newest first
brand: "Project name"          # headline on the card and the page
kind: "AI SaaS platform"       # what kind of product it is
role: "Fullstack Developer"
year: "2026"
featured: true                 # pins it to the top of the list
summary: "Two sentences for the card and meta description."
services: ["Frontend architecture", "Payments"]   # scope, shown in the sidebar
stack: ["Next.js", "TypeScript"]                  # tags on the card
highlights: ["Key feature", "Another one"]
images:
  - "/images/projects/<slug>/cover.png"   # first image is the cover
link: "https://live-site.com"             # omit or leave "" to hide the button
---
```

The markdown body becomes the article.

## Motion

Animation is opt-in per component and always honours `prefers-reduced-motion`:

- `Reveal` — scroll-in reveal via a single `IntersectionObserver` that disconnects after firing.
- `TextReveal` — line-by-line masked headline reveal, with the full string kept in `aria-label`.
- `Magnetic` — pointer-following wrapper, active only on devices with a fine pointer.

Everything else is CSS hover state. The project cards and experience cards ship no
client JavaScript.

## Licence

Built on the Once UI Magic Portfolio template, which is CC BY-NC 4.0 and requires
attribution — that is the "Built on Once UI" link in the footer. Removing it requires a
Once UI Pro licence.
