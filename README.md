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

## Share it on the internet

One command puts this local site on a public, encrypted `https://<random-words>.trycloudflare.com` URL, the same thing [try.cloudflare.com](https://try.cloudflare.com) does. No Cloudflare account, DNS record or router change is involved: `cloudflared` dials out, so the machine needs no open inbound port and its IP stays hidden. What the app serves does become public, though: every route, `/admin` included, is reachable by anyone holding the link.

```bash
brew install cloudflared   # once, official macOS install
npm run share              # starts the site if needed, then the tunnel
```

The community npm wrapper (`npm install -g cloudflared`) is picked up too, as are `~/.npm-global/bin/cloudflared` and `~/.local/bin/cloudflared`. Ctrl+C ends both the site and the tunnel, and the URL disappears with them.

| Command | What it does |
| --- | --- |
| `npm run share` | site + tunnel; reuses port 3007 when it is already serving |
| `npm run share -- --port 3000` | tunnel a site running on another port |
| `npm run share -- --json` | one JSON line (`{"url":"https://..."}`) on stdout for scripts and agents, logs on stderr |
| `npm run tunnel` | tunnel only, for a site you already have running; errors out if nothing is listening on the port |

The tunnel fronts the whole app, **`/admin` included**, and anyone with the link can attempt the admin login. Set a long random `ADMIN_PASSWORD` in `.env.local` before sharing, and close the tunnel when you are done.

Quick Tunnels are built for development and demos: the URL is random, changes on every run, and Cloudflare gives no uptime guarantee. Creating several in a row can also make Cloudflare withhold DNS for the new hostname for a while, in which case the connector registers but the public URL does not resolve yet; `npm run share` checks for that and says so. A stable hostname needs a named tunnel (Cloudflare account plus a DNS record) or a real deploy.

## Deploy (DigitalOcean App Platform)

The spec lives in [`.do/app.yaml`](.do/app.yaml). Apply it with
`doctl apps update <APP_ID> --spec .do/app.yaml`, or paste it under
**App → Settings → App Spec**.

The one rule the platform enforces: the container must listen on `$PORT`, which
App Platform sets from `http_port` (8080). `npm start` runs
`next start -H 0.0.0.0 -p ${PORT:-3007}`, so it follows whatever the platform
hands it and still defaults to 3007 locally. A hardcoded port makes every
readiness probe fail with `connection refused` and the deploy roll back.

Health check: `GET /api/health` returns `{"ok":true}` without touching MongoDB,
so a database blip does not get the container killed and restarted.

Set `MONGODB_URI`, `ADMIN_PASSWORD` and `AUTH_SECRET` as **encrypted** env vars
in the console before the first deploy — the app refuses to start a production
build without `MONGODB_URI`, and `/admin` throws without `AUTH_SECRET`.

Uploads need a Space in production. The container filesystem is ephemeral: with
`DO_SPACES_BUCKET` unset, uploads land in `public/uploads` and disappear on the
next deploy. Set the `DO_SPACES_*` variables so images go to the Space and are
served from its CDN.

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
