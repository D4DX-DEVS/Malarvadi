# മലർവാടി — Malarvadi website

Next.js 14 (App Router) site with all content served from MongoDB and edited through a built-in admin panel.

## Run locally

```bash
cp .env.example .env.local   # then edit values
npm install
npm run seed                 # loads the default content into MongoDB (idempotent)
npm run dev                  # http://localhost:3007
```

Admin panel: http://localhost:3007/admin (password = `ADMIN_PASSWORD` from `.env.local`).

## Environment

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Connection string. Local: `mongodb://127.0.0.1:27017/malarvadi`. For Atlas free tier paste the `mongodb+srv://...` URI and keep `/malarvadi` as the database name. |
| `ADMIN_PASSWORD` | Password for `/admin`. |
| `AUTH_SECRET` | Long random string used to sign the admin cookie. |

Switching to MongoDB Atlas: change `MONGODB_URI`, restart, run `npm run seed` once (or press **Seed default content** in the admin dashboard).

## What is dynamic

Everything below lives in MongoDB and is editable in `/admin`:

- **Home sections**: order, on/off, title and subtitle of every block on the home page (`/admin/home`).
- **Site settings** (`/admin/settings`): site name, SEO, hero copy, ticker lines, about block, stats, contact details, social URLs, app store links, join/CTA/popup/footer copy, and the header text of every inner page.
- **Collections**: news, blog, programs, gallery photos, videos, posters, mentors, timeline, FAQs, "why Malarvadi" features, calendar events. Each has publish toggle and (where relevant) drag-free ↑/↓ ordering.
- **Submissions**: contact form, join form and newsletter popup all save to the `submissions` collection and show under `/admin/submissions`.

Static by design: logos and illustration PNGs in `public/`, hero artwork, the mobile dock, icons (chosen from a fixed list), and the store-badge artwork. Store *links* are dynamic.

## Pages

`/` · `/about` · `/programs` · `/programs/[slug]` · `/news` · `/news/[slug]` · `/blog` · `/blog/[slug]` · `/gallery` (with `?f=photos|videos|events|posters`, lightbox) · `/contact` · `/search?q=` · `/admin/*`

## API

Public reads: `GET /api/content/{collection}`, `GET /api/settings`, `GET /api/home-sections`, `POST /api/submissions`.
Admin (cookie): `POST/PUT/DELETE /api/content/{collection}[/{id}]`, `POST /api/content/{collection}/reorder`, `PUT /api/settings`, `PUT /api/home-sections`, `GET/DELETE /api/submissions`, `POST /api/admin/seed`.
Field definitions and validation for every collection live in `lib/content-registry.ts`; the admin forms are generated from the same file.

## Project layout

```
app/                 routes (server components fetch via lib/queries, render client views)
app/api/             route handlers
app/admin/           admin panel (+ admin.css)
components/home/     home page frame + one file per reorderable section
components/pages/    views for inner pages, lightbox, date helpers
components/admin/    generic DocForm, list, sidebar
lib/                 types, db, registry, queries, defaults, auth, seed
scripts/seed.ts      `npm run seed` / `npm run seed:reset`
```
