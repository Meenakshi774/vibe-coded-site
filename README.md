# Meenakshi Sisodiya — personal site

A small, static personal website built with [Astro](https://astro.build) and plain CSS.
Three pages (Home, About, Projects), a frontend-only newsletter form, and no backend.

## Quick start

Requires Node.js 22.22 or newer (Astro 7). `.node-version` pins Node 22 for Cloudflare.

```bash
npm install       # first time only
npm run dev       # local dev server at http://localhost:4321
npm run build     # production build into ./dist
npm run preview   # serve the production build locally
```

## Where things live

```
src/
├── data/
│   ├── site.js          ← name, nav links, social links, newsletter copy
│   └── projects.js      ← every project (home page shows `featured: true`)
├── styles/global.css    ← colors, fonts, spacing, buttons (design tokens in :root)
├── layouts/BaseLayout.astro  ← <head>, SEO/social meta, fonts, header + footer
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── NewsletterSignup.astro  ← form + validation script
│   ├── ProjectCard.astro
│   └── SectionHeading.astro
└── pages/               ← one file per route
    ├── index.astro      → /
    ├── about.astro      → /about/
    └── projects.astro   → /projects/
public/                  ← copied as-is (favicon.svg, robots.txt)
```

## Replacing placeholder content

Everything marked **PLACEHOLDER** or `[Placeholder]`, or showing `XX`/`20XX`, is temporary.

| What | Where |
| --- | --- |
| Name, site description, newsletter copy | `src/data/site.js` |
| Social links (currently `example.com` placeholders) | `socialLinks` in `src/data/site.js` |
| Projects (title, description, category, year, link) | `src/data/projects.js` |
| Project filter categories | `projectCategories` in `src/data/projects.js` |
| Hero, intro and highlight stats | `src/pages/index.astro` |
| Story, timeline and values | `src/pages/about.astro` |
| Favicon | `public/favicon.svg` |

To **remove the highlights/stats section**, delete the `<!-- Highlights -->` section in `src/pages/index.astro`.

## Design system

- **Colors:** only `#FFFFFF`, `#000000` and `#E10600`, defined as `--color-white`, `--color-black` and `--color-red` in `global.css`.
- **Fonts:** Switzer 400 (body/UI) and Khand 700 (display), loaded from Fontshare in `BaseLayout.astro`. They are requested as two separate stylesheets because Fontshare's combined URL sometimes returns only Switzer.
- **Red** is reserved for CTAs, highlighted headline words and small accents. Red text is never used on black, because the contrast is too low.
- Motion is limited to hover states and a short fade-up on page intros. All of it is disabled when the visitor prefers reduced motion.

## Newsletter form (demo mode)

The form in `src/components/NewsletterSignup.astro` validates the email in the browser and then shows:

> Thanks! The signup form is ready to connect to the newsletter service.

**Nothing is sent or stored.** The email is discarded.

### Connecting a newsletter provider later

Most providers (Buttondown, ConvertKit/Kit, Beehiiv, Mailchimp, etc.) offer either:

1. **An HTML form endpoint.** Set the `<form>`'s `action` to the provider's URL. Make sure the input `name` matches what the provider expects. Then remove `event.preventDefault()` from the success path of the script. Or
2. **An embed or API call.** Replace the `DEMO ONLY` block in the script with a `fetch()` to the provider's public subscribe endpoint.

Then update `demoSuccessMessage` in `src/data/site.js` to a real confirmation, such as "Check your inbox to confirm." Never put a secret API key in frontend code.

## SEO

Each page sets its own `title` and `description` through `BaseLayout`. Open Graph and Twitter tags are generated automatically, and `public/robots.txt` allows all crawlers.

When you have a real domain:

1. Add `site: 'https://your-domain.com'` to `astro.config.mjs`. Canonical and `og:url` tags then appear automatically.
2. Optionally run `npx astro add sitemap` to generate a sitemap. After that, add `Sitemap: https://your-domain.com/sitemap-index.xml` to `public/robots.txt`.

## Deploying to Cloudflare (free tier)

The site deploys as a Cloudflare **Worker with static assets**. `wrangler.jsonc` tells Cloudflare to serve the `dist` folder. There's no server code, and it fits within the free plan.

Cloudflare project settings (**Settings → Build**):

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Node comes from `.node-version`, so no environment variables are needed. Every push to `main` rebuilds and redeploys automatically.

The `name` in `wrangler.jsonc` must match the Worker's name in the dashboard (`vibe-coded-site`).

To add a custom domain later, go to the Worker's **Settings → Domains & Routes**. Then set `site` in `astro.config.mjs` as described above.
