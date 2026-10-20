# AGENTS.md

Guidance for AI coding assistants (and humans) working on this repository.
Read this before making changes. For setup and deployment steps aimed at the site owner, see `README.md`.

## Project summary

A small, static personal portfolio website for **Meenakshi Sisodiya**. It has two goals:

1. Introduce the owner: who they are, what they do and what they've built.
2. Grow a weekly newsletter audience through a prominent email signup form.

> Pronoun note: the site copy avoids pronouns for the owner. Write in the first person ("I'm Meenakshi…") or use the name. Don't introduce third-person pronouns unless the owner specifies them.

The design is minimal, bold, typography-led, high-contrast and editorial. It should feel art-directed, not like a generic template.

All bio, project, stat, timeline and social content is **placeholder**. Never replace it with invented facts.

## Commands

```bash
npm install       # install dependencies (only `astro`)
npm run dev       # dev server at http://localhost:4321
npm run build     # static build into ./dist (must pass before any commit)
npm run preview   # serve ./dist locally (no signup API)
npm run preview:cloudflare  # build + run site and Worker/D1 locally at :8787
```

- Node.js **22.22+** is required (Astro 7). `.node-version` pins Node 22 for the Cloudflare build.
- `.claude/launch.json` defines an `astro-dev` preview config for the Claude desktop app. It is git-ignored.

## Tech stack and hard constraints

- **Astro 7** (static output, no adapter) with **plain CSS**. `astro` is the only dependency.
- Hosting: **Cloudflare Workers (static assets)**, free tier. Build command `npm run build`, deploy command `npx wrangler deploy`, configured by `wrangler.jsonc` (serves `./dist`).
- Fonts: **Switzer 400** (body/UI) and **Khand 700** (display) from Fontshare.

Do **not** add any of the following unless the owner explicitly asks:

- React, Next.js, Tailwind or another UI framework
- A CMS, auth, or any server code beyond the small signup Worker
- Analytics, search, a blog system, or an admin dashboard
- Third-party newsletter integrations, or storing anything about subscribers beyond email + signup time
- Animation libraries, extra npm packages, or environment variables

Prefer static rendering. Keep client-side JavaScript to the two existing small scripts.

## File map

```
AGENTS.md                 ← this file
README.md                 ← owner-facing setup, content editing and deployment guide
astro.config.mjs          ← empty config; add `site: 'https://…'` once a domain exists
.node-version             ← "22" (read by Cloudflare's build)
wrangler.jsonc            ← Cloudflare Worker config: name, assets (./dist), /api/* → worker, D1 binding DB
worker/index.js           ← Worker: POST /api/subscribe saves emails to D1; everything else → static assets
public/
  favicon.svg             ← black square, white "MS", red bar
  robots.txt              ← allow all (add Sitemap line once a domain + sitemap exist)
src/
  data/
    site.js               ← SINGLE SOURCE for name, wordmark, default description,
                            nav links, social links, newsletter copy
    projects.js           ← SINGLE SOURCE for all projects + filter categories
  styles/global.css       ← design tokens (:root), reset, typography, buttons,
                            focus styles, .rise entrance animation, reduced-motion
  layouts/BaseLayout.astro← <head> (title, meta, OG/Twitter, fonts), skip link,
                            Header, <main id="main">, Footer
  components/
    Header.astro          ← wordmark, nav (aria-current), Newsletter CTA
    Footer.astro          ← big wordmark, page/social/newsletter links, copyright
    NewsletterSignup.astro← newsletter section + form + script (POSTs to /api/subscribe)
    ProjectCard.astro     ← card with typographic placeholder visual
    SectionHeading.astro  ← eyebrow + Khand heading with optional red highlight
  pages/
    index.astro           → /           hero, intro, featured projects, highlights, newsletter
    about.astro           → /about/     intro, story, timeline, values, closing CTA, newsletter
    projects.astro        → /projects/  intro, filter buttons, all projects grid, newsletter
```

Component-specific CSS lives in scoped `<style>` blocks inside each `.astro` file. Global, shared rules live in `global.css`.

## Where content lives

| Content | Location |
| --- | --- |
| Owner name, wordmark, default meta description | `src/data/site.js` → `site` |
| Nav links | `src/data/site.js` → `navLinks` |
| Social links (`example.com` placeholders) | `src/data/site.js` → `socialLinks` |
| Newsletter heading, copy, button label, success message | `src/data/site.js` → `newsletter` |
| Projects (title, description, category, year, href, featured) | `src/data/projects.js` → `projects` |
| Filter categories | `src/data/projects.js` → `projectCategories` |
| Hero copy, "I'm Meenakshi." intro, highlight stats | `src/pages/index.astro` |
| Story, timeline milestones, values | `src/pages/about.astro` (arrays in frontmatter) |
| Per-page `<title>` and meta description | `title` / `description` props on `<BaseLayout>` in each page |
| Favicon initials | `public/favicon.svg` |

**Renaming the owner:** change `site.name` and `site.wordmark` in `site.js`. Then update the intro heading and paragraph in `index.astro`, the page `description` props in all three pages, the favicon initials, the `package.json` name and the README title. Grep for the old name afterwards to confirm nothing is left.

Rules for project data:
- `category` must exactly match an entry in `projectCategories`, or filtering breaks.
- The home page shows the first three projects with `featured: true`.
- An empty `year` (`''`) hides the year.
- Placeholder links use `https://example.com/...`. Never invent real URLs or social profiles.

## Design system

### Colors (only these three)

| Token | Value | Use |
| --- | --- | --- |
| `--color-white` | `#FFFFFF` | Primary background, negative space (should dominate) |
| `--color-black` | `#000000` | Text, nav, borders, structure, newsletter panel, footer |
| `--color-red` | `#E10600` | CTAs, newsletter button, highlighted headline words, small accents, active nav underline, focus ring |

- Opacity variants only: `--color-muted` (black at 0.64) for secondary text on white, and `--color-muted-inverse` (white at 0.72) for secondary text on black.
- No other colors, gradients, glassmorphism or decorative shadows.
- **Never use red text on black.** Its contrast (~3.3:1) fails for normal text. On black, hover states use a red *underline* with white text (see `Footer.astro`). Large red display text on black (the newsletter "ONCE A WEEK.") is acceptable because it passes the 3:1 large-text threshold.
- Red on white (~6.4:1) and white on red are fine.

### Typography

- `--font-body`: Switzer 400, used for paragraphs, nav, buttons, labels and captions.
- `--font-display`: Khand 700, used for `h1`, `h2`, `h3` and `.display`. Always uppercase, tight line-height (0.86 to 1).
- Display sizes are fluid: `--display-xl`, `--display-lg`, `--display-md`, `--display-sm` (all `clamp()`).
- Small uppercase labels use `.eyebrow` (letter-spaced Switzer).
- Red emphasis inside headings uses `<span class="highlight">`.
- Headings use `text-wrap: balance` to avoid orphaned words. Don't override it.

### Layout and spacing

- `.container` has a max-width of 80rem with a fluid `--gutter`.
- `.section` uses `--section-space` vertical padding. Adjacent sections get a 1px black top border automatically.
- Spacing scale runs from `--space-1` to `--space-8`. Use the tokens, not arbitrary values.
- Grids use `repeat(auto-fill/auto-fit, minmax(min(100%, Nrem), 1fr))` so they never overflow.
- Corners are square. No rounded cards or heavy shadows.

### Buttons and links

- Buttons: `.button` (black), `.button--accent` (red), `.button--outline`. Minimum height is about 44px for touch.
- Inline links use `.text-link` (red underline). "More →" style links use `.arrow-link`.

### Motion

- Hover and focus transitions use `--transition` (180ms).
- `.rise` with `.rise-delay-1/2/3` gives a short fade-up, used only on page intros.
- A `prefers-reduced-motion: reduce` rule in `global.css` disables animation and transitions globally. Keep it.

## Behavior that must be preserved

### Newsletter signups (`NewsletterSignup.astro` + `worker/index.js`)

Frontend (`NewsletterSignup.astro`):
1. The form has `action="/api/subscribe" method="post" novalidate`. Without JavaScript it still submits, and the Worker replies with a simple HTML page.
2. The script checks the email first. Empty or invalid input shows an inline error and sets `aria-invalid="true"`. Typing clears the error.
3. On a valid submit, the script `fetch`es `/api/subscribe` with `Accept: application/json`. The button shows "Sending…" and is disabled while it waits.
4. On `{ ok: true }`, it resets the form and shows `newsletter.successMessage`. Otherwise it shows the server's `error`, or a generic message.
5. A hidden honeypot input named `website` must stay empty, hidden off-screen, and out of the tab order.
6. Message `<p>` elements must stay truly empty in markup (`></p>`), because CSS hides them with `:empty`.
7. Messages use white text plus a red "!" or "✓" marker, so meaning doesn't rely on color alone.

Backend (`worker/index.js`):
- `wrangler.jsonc` sets `run_worker_first: ["/api/*"]`, so only API calls run the Worker. Pages are served directly from assets.
- `POST /api/subscribe` reads form data and checks the honeypot (a filled honeypot gets a fake success and nothing is saved). It validates and lowercases the email (max 254 characters), then runs `CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, created_at TEXT)` followed by `INSERT … ON CONFLICT(email) DO NOTHING`.
- Replies are JSON when `Accept: application/json`, otherwise a tiny HTML page. Other `/api/*` paths return a 404 JSON response.
- Store **only** email and signup time. Don't log emails, and don't store IP addresses or other tracking data.
- This only collects subscribers. Sending the newsletter happens outside this repo, in an email tool that provides unsubscribe links.
- D1 binding: `DB`, database `vibe-coded-site-subscribers`, auto-provisioned on deploy (no `database_id` in config). If provisioning ever fails, create the database in the dashboard and add `database_id`.

The section has `id="newsletter"`. The header CTA, hero CTA, About CTA and footer link all point to `#newsletter`, so keep exactly one `NewsletterSignup` per page.

### Project filter (`projects.astro`)

- Buttons are rendered with `hidden` and revealed by the script. Without JavaScript there are no dead controls, and all projects show.
- Buttons use `aria-pressed`. A visually hidden `role="status"` element announces "Showing N projects."
- Filtering sets `hidden` on `.project-grid > li` elements by their `data-category`.

### Header

- Desktop: wordmark on the left, nav and red "Newsletter" button on the right.
- Mobile (≤40rem): wordmark and button on the top row, page links on a full-width second row (`order: 3`). There is deliberately **no hamburger menu** and no JavaScript.
- On 320px screens the long wordmark pushes the button onto its own row, which is acceptable.
- The current page link gets `aria-current="page"` and a red underline. The path is normalised for trailing slashes.

### Project cards

- The whole card is clickable via a stretched `::after` on the title link, so there's one link per card for screen readers.
- Placeholder visuals rotate black, then outline, then red by index. They are `aria-hidden`.

### SEO and metadata

- `BaseLayout` outputs `<title>` as "Page — Meenakshi Sisodiya" (home: a tagline plus the name), along with the meta description, Open Graph and Twitter `summary` tags, and the favicon.
- Canonical and `og:url` tags are emitted **only** when `site` is set in `astro.config.mjs`. Don't invent a production domain.
- Sitemap: not installed. Once a domain exists, run `npx astro add sitemap` and add a `Sitemap:` line to `robots.txt`.

## Known gotchas

1. **Fontshare combined URL is unreliable.** `?f[]=switzer@400&f[]=khand@700` sometimes returns only Switzer, so Khand silently falls back to Arial Narrow or Impact. Keep the two **separate** `<link rel="stylesheet">` tags in `BaseLayout.astro`. To verify, run `document.fonts` in the browser; both "Switzer 400" and "Khand 700" should show `loaded`.
2. **Astro strips whitespace between adjacent `{expressions}` and elements.** For example, `{title}` followed on the next line by `<span>` renders "THINGSIBELIEVE". Insert `{' '}` where a space is needed. This also matters for screen readers (e.g. `happen.{' '}Then`).
3. **`display` overrides the `hidden` attribute.** If you add `hidden` to an element whose class sets `display`, also add a `[hidden] { display: none; }` rule (see `.filters[hidden]` and `.project-grid > li[hidden]`).
4. **Git repo location.** This folder has its own `.git`. The owner's home directory is also a git repo, so always run git commands from this project folder.

## Accessibility checklist (keep these true)

- One `h1` per page and a logical h2/h3 order. Visually hidden headings are used where a section has no visible one.
- Skip link to `#main`.
- Visible `:focus-visible` ring: 3px red. It switches to white on the red submit button inside the black panel.
- Form input has an explicit `<label>`. Errors are linked through `aria-describedby`, and the success message is in a `role="status"` region.
- Touch targets are about 44px or larger.
- Decorative elements use `aria-hidden="true"`. Any meaningful image added later needs `alt` text; decorative ones need `alt=""`.
- Information is never conveyed by color alone.

## Verification before finishing any change

1. `npm run build` completes with no errors.
2. No horizontal overflow at 320, 375, 768 and 1280px on all three pages. A quick check in the browser console: `document.documentElement.scrollWidth <= innerWidth`.
3. No console errors.
4. Using `npm run preview:cloudflare` (http://localhost:8787): an empty or invalid email shows an inline error. A valid email shows the success message and appears in the local D1 database (`npx wrangler d1 execute vibe-coded-site-subscribers --local --command "SELECT * FROM subscribers"`). Signing up twice doesn't duplicate the row.
5. The project filter shows the correct projects per category.
6. Internal links (`/`, `/about/`, `/projects/`, `#newsletter`) all resolve.
7. No invented facts, metrics, testimonials, dates or real-looking social URLs were added.

## Deployment

Cloudflare **Worker with static assets**, connected to GitHub (`Meenakshi774/vibe-coded-site`):

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- `wrangler.jsonc` sets `assets.directory` to `./dist`. Its `name` must match the Worker name (`vibe-coded-site`).
- Node comes from `.node-version`. Every push to `main` redeploys.
- Bindings: `ASSETS` (static files) and `DB` (D1). No environment variables or secrets.
- To validate the config locally: `npm run build && npx wrangler deploy --dry-run`.

## Out of scope (for now)

Blog, CMS, auth, sending emails from the site, third-party newsletter APIs, payments, analytics, complex animation, loading screens, search, complex filtering, admin dashboard. Only add one if the owner asks.

## Style for code changes

- Keep code readable and boring. Use descriptive names and avoid needless abstractions.
- Don't create a component for every small element.
- Comments should explain how to customise things, not narrate each line.
- Match the existing patterns: data in `src/data`, tokens in `global.css`, scoped styles in components.
