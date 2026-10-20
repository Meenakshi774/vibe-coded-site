# Meenakshi Sisodiya — personal site

A small, static personal website built with [Astro](https://astro.build) and plain CSS.
Three pages (Home, About, Projects) and a working newsletter signup form. Signups are saved to a free Cloudflare D1 database by a tiny Worker (`worker/index.js`).

## Quick start

Requires Node.js 22.22 or newer (Astro 7). `.node-version` pins Node 22 for Cloudflare.

```bash
npm install       # first time only
npm run dev       # local dev server at http://localhost:4321
npm run build     # production build into ./dist
npm run preview   # serve the production build locally (no signup API)
npm run preview:cloudflare  # build + run the site AND signup API locally (http://localhost:8787)
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

## Newsletter signups (Cloudflare D1)

How it works:
1. The form in `src/components/NewsletterSignup.astro` checks the email, then POSTs it to `/api/subscribe`.
2. `worker/index.js` validates it again and saves it to the D1 database `vibe-coded-site-subscribers`, in the table `subscribers` (`email`, `created_at`). The table is created automatically on the first signup.
3. Duplicate signups are ignored. A hidden "website" field catches simple spam bots.

The success message is `newsletter.successMessage` in `src/data/site.js`.

**Seeing your subscribers:** in the Cloudflare dashboard, go to **Storage & databases → D1 → vibe-coded-site-subscribers → Console**, and run:

```sql
SELECT email, created_at FROM subscribers ORDER BY created_at DESC;
```

**Removing someone** (e.g. an unsubscribe request):

```sql
DELETE FROM subscribers WHERE email = 'person@example.com';
```

**Sending the newsletter:** this setup only *collects* emails. To send, copy the list into an email tool (Kit, Buttondown, MailerLite, etc.). Every email you send must include an unsubscribe link, and those tools add one for you.

`/api/subscribe` doesn't exist under `npm run dev`, so the form shows an error there. Use `npm run preview:cloudflare` to test signups locally. That uses a local test database, not the real one.

## SEO

Each page sets its own `title` and `description` through `BaseLayout`. Open Graph and Twitter tags are generated automatically, and `public/robots.txt` allows all crawlers.

When you have a real domain:

1. Add `site: 'https://your-domain.com'` to `astro.config.mjs`. Canonical and `og:url` tags then appear automatically.
2. Optionally run `npx astro add sitemap` to generate a sitemap. After that, add `Sitemap: https://your-domain.com/sitemap-index.xml` to `public/robots.txt`.

## Deploying to Cloudflare (free tier)

The site deploys as a Cloudflare **Worker with static assets**. `wrangler.jsonc` tells Cloudflare to serve the `dist` folder, run `worker/index.js` for `/api/*` requests, and connect the D1 database (as `DB`). It fits within the free plan.

The D1 database is created automatically on the first deploy. If a deploy ever fails because of it, create a D1 database named `vibe-coded-site-subscribers` in the dashboard. Then add its ID as `"database_id"` in `wrangler.jsonc`.

Cloudflare project settings (**Settings → Build**):

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Node comes from `.node-version`, so no environment variables are needed. Every push to `main` rebuilds and redeploys automatically.

The `name` in `wrangler.jsonc` must match the Worker's name in the dashboard (`vibe-coded-site`).

To add a custom domain later, go to the Worker's **Settings → Domains & Routes**. Then set `site` in `astro.config.mjs` as described above.
