# Malarvadi Website — Phase 1 (Implemented)

Original Malarvadi website for the children's organization (students up to Class 7).
Reference image used as inspiration only — all UI, branding and content here are original.

## Monorepo

- `frontend/` — Next.js 15 App Router + TypeScript + Tailwind 3, bilingual `/en` + `/ml`
- `backend/` — Node.js + Express + TypeScript REST API (`/api/v1`), single admin, JWT httpOnly cookie
- `shared/` — Shared TypeScript + Zod schemas (`{ en, ml }` bilingual primitives, resource schemas)

## Quick start

```powershell
npm install

# Backend (demo mode without DB; full mode with MONGODB_URI)
Copy-Item backend\.env.example backend\.env
npm run dev:backend   # API process on port 4000

# Frontend
Copy-Item frontend\.env.example frontend\.env.local
npm run dev:frontend  # http://localhost:3000 -> /en
```

Or `npm run dev` from the root to start both.

**Never run `npm run build` while `npm run dev` is running** — they share
`frontend/.next` and the build will pull chunks out from under the dev server
(`Cannot find module './697.js'`). Stop the dev server first.

### One port

The browser only ever talks to `http://localhost:3000`. The site is there, the
admin panel is at `/admin`, and `/api/v1/*` is rewritten to the Express process
by `frontend/next.config.ts` (`API_ORIGIN`). Port 4000 is an implementation
detail — nothing in the browser references it, and the session cookie is
same-origin as a result.

## Public pages (all EN + ML)

Home, About, Objectives, History (timeline: 1980 magazine, 2003 Balasangham,
2009 Rainbow, 2024 Zaitoon), Programs (+ type filter + detail), Events
(upcoming/past + detail), Leaders (state/district/advisor), News (+ detail),
Gallery (albums + lightbox detail), Contact (validated form → API).

Dynamic sections read from the API with ISR (60s) and fall back to clearly
labeled demo cards when no data exists. Demo content is never presented as real.

## Admin (`/admin`, English UI, bilingual editors)

Same server, same port as the public site: `http://localhost:3000/admin`.

### Admin account

There is exactly one admin and it is not stored in the database. Set it in
`backend/.env`:

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=some-long-password
JWT_SECRET=<any long random string>
```

Restart the backend and those credentials are the login. No signup, no users
collection, no roles, no password reset flow — to change the login, edit the
file. `.env` is gitignored, so real values never reach the repo.

Login at `/admin/login` (email + password). Dashboard with counts, then modules:
Programs, Events, News, Leaders, Gallery, Pages, Publications (Phase 2 ready),
Messages (new/read/replied/spam), Media Library (presigned direct-to-Spaces upload).

Editors show `English | മലയാളം` tabs, require English before publishing and warn
when Malayalam is missing.

## Backend API (selected)

- `GET /api/v1/health`
- `POST /api/v1/auth/login|logout`, `GET /api/v1/auth/me`
- Public: `GET /programs[/:slug] /events[/:slug] /news[/:slug] /leaders /gallery[/:slug] /pages/:slug /publications[/:slug]`, `POST /contact`
- Admin: `/api/v1/admin/<programs|events|news|leaders|gallery|pages|publications>` CRUD + `/contact-messages` + `/media` + `/upload/request-url|complete`
- Pagination `?page&limit`, search `?q`, filters (`type`, `scope=upcoming|past`, `district`, `group`, `kind`, `status`)

## Database (MongoDB Atlas)

Collections: `users programs events news leaders gallery_albums pages
publications contact_messages media_assets`. Static pages (About/Objectives/
History) live in frontend dictionaries; `pages` collection is available if they
ever need admin editing — no new collections required for Phase 2
(`programs.type` covers Little Scholar/Rainbow/Balolsavam; `publications.kind`
covers magazine/video/audio).

Seed demo data locally only (never production):

```powershell
$env:SEED="true"
npm run seed --workspace=backend
```

The seed only inserts demo content. It does not create a login — see Admin
account below.

## Media (Spaces + CDN, architecture active, prod not wired)

Admin browser → `POST /admin/upload/request-url` → browser PUTs directly to
Spaces → `POST /admin/upload/complete` → MongoDB stores `{ key, cdnUrl }` →
frontend renders CDN URL. No server tmp uploads, no secrets in the browser.
Configure `DO_SPACES_*` + `DO_CDN_BASE_URL` in `backend/.env` when ready.
Movies/Songs (Phase 2): prefer YouTube embeds via `publications.fileUrl`.

## Security

One admin account, defined by `ADMIN_EMAIL` / `ADMIN_PASSWORD` in
`backend/.env` — there is no users collection, no signup and no roles. Login
compares those two values in constant time and sets a 7-day JWT in an httpOnly
`SameSite=Lax` cookie (`Secure` in production). To change the login, edit
`.env` and restart the backend; rotating `JWT_SECRET` invalidates the session
immediately. Helmet, CORS allowlist, rate limits
(login/contact/upload), Zod validation everywhere, generic error shape
`{ error: { code, message } }` with no stack leaks. CAPTCHA/Turnstile to be added
before production launch.

## SEO / a11y / performance

Localized metadata + canonical + hreflang per page, `sitemap.xml` + `robots.txt`,
semantic HTML, keyboard-accessible menus/dialogs, 44px+ targets,
`prefers-reduced-motion` respected, `next/image`-ready CDN remote patterns,
lazy gallery images, ISR 60s on dynamic reads.

## Env vars (names only — see `.env.example` files)

Frontend: `NEXT_PUBLIC_APP_URL NEXT_PUBLIC_DEFAULT_LOCALE API_ORIGIN`
Backend: `PORT NODE_ENV FRONTEND_URL MONGODB_URI ADMIN_EMAIL ADMIN_PASSWORD
JWT_SECRET DO_SPACES_ENDPOINT DO_SPACES_BUCKET DO_SPACES_REGION DO_SPACES_KEY
DO_SPACES_SECRET DO_CDN_BASE_URL`

## Checks

```powershell
npm run typecheck --workspaces --if-present
npm run lint --workspace=frontend
npm run build --workspace=backend
npm run build --workspace=frontend
```

## Deployment notes (when approved)

Frontend: any Next.js host (Vercel/Node). Backend: Node host with env vars set.
DB: Atlas allowlist backend IP. Spaces: private bucket + public CDN subdomain.
Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` and a long random `JWT_SECRET` on the
backend host — that is the whole admin account. Add CAPTCHA key, set `Secure`
cookies (prod), run `npm run seed` never in prod.
