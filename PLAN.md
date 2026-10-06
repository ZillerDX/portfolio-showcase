# PLAN: Portfolio credibility pass (job search: Software Engineer / AI Engineer)

Branch: `fix/portfolio-credibility` · Size: large (content + data + public-facing) · Nothing is committed/pushed until the owner says so.

## Goal
Make the portfolio and GitHub profile consistent with the real resume (Krones IT Intern Dec 2025 – Sep 2026; self-taught software projects) so a recruiter can trust it in 30 seconds. Success = no claim a reviewer can disprove, no template leftovers, every project card has working Demo + Code links.

## Key finding (changes the approach)
`prisma/dev.db` is the source of truth and **differs from `prisma/seed.js`** (seed is stale: wrong LinkedIn URL, template projects, "Present" date). `db:seed` must NOT be run. Content changes go through a one-off script `scripts/update-profile-copy.js` applied to `dev.db`.

## Milestones

### M1 — Plan + safety
- [x] Branch, deps installed, `.env` from example (untracked)
- [x] Backup DB before any write: `prisma/dev.db.bak` (gitignored? verify before commit)
- Done when: `git status` shows only intended files.

### M2 — Profile copy (DB)
- [x] title → "Software Engineer | .NET · Angular · React | AI Integration"
- [x] bio → factual, no "autonomous agents / digital twin" claims
- [x] availabilityText → "Available for full-time Software Engineer / AI Engineer roles"
- [x] hero line "Principal Systems & Design Architecture" → factual text (hero.tsx)
- Done when: homepage shows new text on localhost.

### M3 — Project cards
- [x] Bug: card icons only render link type `demo`; QueueFlow/DeskFlow/EquipLend/Jodnoi use `live` → treat `live` as demo; add visible "Demo" / "Code" labels
- [x] Rename link label "Production App" → "Live Demo" (OptiTrack)
- [x] Verify every demo/GitHub URL returns 200
- Done when: all 11 cards show both icons; link check script prints all OK.

### M4 — Remove template leftovers
- [x] Delete `alex-chen-resume.pdf`, `sample-certificate-{aws,cka,meta}.pdf`, template whitepaper PDFs, `scripts/generate-assets.js` (creates them)
- [x] Fix "Alex Chen" in `api/profile/route.ts`, admin placeholder, `scripts/test-api.js`
- [ ] Not touched (follow-up): `seed.js`, `test-crud.js`, `verify-showcase.mjs`, `project-apex.svg` default cover — still reference template data
- Done when: `grep -ri "alex chen"` has no hits in src/ and unreferenced files are gone; build passes.

### M5 — Docs
- [x] README: replace "10 Authentic Production Systems" with accurate wording; remove "Architect" tagline
- [x] CLAUDE.md: warn that seed.js is stale
- Done when: README claims match reality.

### M6 — Verify
- [x] `npm run lint` (0 errors, only img warnings), `npm run build`, `tsc --noEmit`
- [x] Dev server (port 3001): new copy/title served, 11 Demo + 11 Code links, resume/project routes 200. [ ] Visual check of project modal/mobile not done
- Done when: results reported with output.

## GitHub profile (needs owner confirmation per action — NOT automated)
Drafts go in `docs/github-profile/` for review:
- [x] Profile README draft (~30 lines)
- [x] Table: repos to archive/delete, pin list, descriptions/topics to set
- Owner then approves; edits via `gh` happen one by one.

## Local verification
`npm run dev` → http://localhost:3000 (admin: /admin/login, creds from `.env`).

## Production checklist
- `prisma/dev.db` is the deployed data: commit the updated DB together with the code, then push (Vercel redeploys).
- Resume PDF in `public/uploads/documents/tanathon-chanapha-resume.pdf` is the latest version (confirm vs. Downloads copy).
- Set `SESSION_SECRET` / `ADMIN_PASSWORD` in Vercel env (not in repo).
- Rollback: `git revert` + restore `prisma/dev.db.bak`.

## Extra done
- QR-Menu demo link was 404 (old Vercel URL) → fixed to GitHub Pages in DB. Page `<title>`/meta in layout.tsx updated.

## Next
Owner reviews `git diff` + localhost (`npm run dev`; port 3000 was taken by another process, Next used 3001). If OK: commit on `fix/portfolio-credibility` (include `prisma/dev.db`), push, Vercel redeploys. Then approve items in `docs/github-profile/ACTIONS.md` one by one. Follow-ups: stale `seed.js`/`test-crud.js`/`verify-showcase.mjs`, visual mobile check, add case-study metrics for Krones.
