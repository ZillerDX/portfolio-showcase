# portfolio-showcase

Personal portfolio + admin CMS for Tanathon Chanapha (single tenant). Public showcase of projects/certificates/resume at https://portfolio-tanathon.vercel.app.

Stack: Next.js 14 (App Router) · React 18 · TypeScript · Tailwind 3 · Prisma 5 + SQLite · react-markdown/remark-gfm · Lucide icons.

## Commands

```bash
npm install            # also runs prisma generate (postinstall)
npm run dev            # http://localhost:3000
npm run build          # prisma generate && next build
npm run lint           # next lint
npm run db:push        # apply schema to SQLite
npm run db:seed        # WIPES all tables, reseeds real portfolio data (prisma/seed.js)
node scripts/test-api.js   # smoke test; needs dev server running on :3000
node scripts/verify-showcase.mjs  # asserts against the DB via Prisma
```

No unit-test runner is configured. Verification = `npm run build` + `npm run lint` + run the dev server and check the pages by hand (or the scripts above).

## Architecture

- `src/app/page.tsx` — Server Component; loads profile/projects/certificates via Prisma and hands them to client components.
- `src/components/public/*` — showcase UI (navbar, hero, filter, cards, detail modal, resume modal, certificates). `showcase-client.tsx` owns filter state.
- `src/app/admin/(dashboard)/*`, `admin/certificates`, `admin/login` — admin CMS. `src/components/admin/*` for forms.
- `src/app/api/*` — REST routes: auth, categories, certificates, profile, projects, upload.
- `src/lib/auth.ts` — hand-rolled HMAC-signed session cookie (`portfolio_admin_session`, 7 days). There is no `middleware.ts`; each admin page/API route must check the session itself.
- `src/lib/db.ts` — Prisma singleton. On Vercel/Lambda it copies `prisma/dev.db` to `os.tmpdir()` because the deploy FS is read-only.
- Schema (`prisma/schema.prisma`): Profile, Category, Project (+ ProjectImage, ProjectLink), Certificate. List fields (`tagsJson`, `skillsJson`) are JSON strings, not relations.

## Gotchas

- **`prisma/dev.db` is committed and is the production data source** (traced into the Vercel build via `next.config.mjs`). Content changes are made by editing the DB / `seed.js` and committing the db file. Runtime writes on Vercel go to `/tmp` and are lost — admin edits and uploads only persist when run locally and then committed.
- `public/uploads/**` (PDFs, images) is also committed; `/api/upload` writes there with `fs.writeFile`, so it does not work on Vercel.
- **`prisma/seed.js` is stale** (wrong LinkedIn URL, template projects, outdated dates) — the DB is the source of truth. Do not run `db:seed`; make content changes with a one-off script like `scripts/update-profile-copy.js`.
- `db:seed` deletes everything first. Never run it against data you have not backed up (`cp prisma/dev.db prisma/dev.db.bak`).
- `prisma/schema.prisma` `binaryTargets` includes rhel/debian targets for Vercel; keep them.
- `scripts/*` (other than the test/verify ones) are one-off content migrations (`update-queueflow.js`, `remove-microsme.js`); don't treat them as maintained tooling.
- `next.config.mjs` sets `images.unoptimized: true`.
- `src/lib/auth.ts` falls back to a hardcoded secret when `SESSION_SECRET` is unset — always set it in production.

## Environment

Required env var names (see `.env.example`; real `.env` is gitignored): `DATABASE_URL` (`file:./dev.db`), `ADMIN_PASSWORD`, `SESSION_SECRET` (32+ chars).
Local admin: `http://localhost:3000/admin/login`.

## Conventions

- Conventional Commits in English (`feat(showcase): ...`, `fix(jodnoi): ...`, `docs: ...`); branches `feat/`, `fix/`, `chore/`.
- Case-study copy in the DB/docs is written in professional English.
- Server Components by default; `"use client"` only for interactive components.
