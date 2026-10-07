// One-off content update for prisma/dev.db (prisma/seed.js is stale).
// 1) Replace the profile skills list with skills that are evidenced in the GitHub repos / resume.
// 2) Rewrite the QueueFlow, DeskFlow, EquipLend and Jodnoi case studies in plain, verifiable language.
// Usage: node scripts/update-skills-and-case-studies.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const group = (category, names) => ({ category, skills: names.map((name) => ({ name })) });

const skills = [
  group("Frontend and UI", ["React", "Next.js", "Angular", "TypeScript", "Tailwind CSS", "Flutter and Dart", "Vite", "WebGL2 and GLSL", "PWA", "Recharts and D3.js"]),
  group("Backend and Real-Time", [".NET and C#", "ASP.NET Core Minimal APIs", "Entity Framework Core", "SignalR and WebSockets", "Python and FastAPI", "Node.js and Express", "REST APIs"]),
  group("Data and Cloud", ["PostgreSQL and SQL", "SQLite", "Supabase", "MongoDB", "Redis", "Prisma ORM", "Docker", "Vercel", "Cloudflare", "GitHub Actions"]),
  group("AI and Quality", ["LLM integration (Gemini, Groq) with fallbacks", "Claude Code", "Model Context Protocol", "TensorFlow.js", "xUnit, Vitest and Pytest", "Accessible UI (contrast checks)"]),
  group("Enterprise Tools", ["Power Apps", "Power Automate", "SharePoint", "Power BI", "Microsoft Copilot"]),
];

const caseStudies = {
  queueflow: `## Overview

**QueueFlow** is a queue and service-counter management system for places like clinics, banks and service centres. Customers take a ticket on their phone by scanning a QR code, staff call the next number from a desk terminal, and a TV display shows who is being served. There is no app to install and no account to create.

## What it does

| Part | What you get |
| :-- | :-- |
| **Customer intake** | Pick a service (A / B / C), get a digital ticket with position and estimated wait time |
| **Staff terminal** | Call next, recall, start service, skip, no-show, transfer; switch between desks |
| **TV display** | 16:9 board with now-serving counters and the next in line, with a chime and Thai / English speech |
| **Branch management** | Services and counters, letter prefixes, desk binding and printable QR stands |

## How it works

1. **Atomic "Call Next".** When several staff press the button at the same time, the backend claims a ticket with PostgreSQL \`SELECT ... FOR UPDATE SKIP LOCKED\`, so two desks never get the same ticket.
2. **Live updates.** SignalR pushes changes to customer phones, staff terminals and the TV board.
3. **Estimated wait.** A rolling average of recent service times and the number of open counters.
4. **Hosted demo.** The live demo is a standalone PWA on Vercel that syncs browser tabs with BroadcastChannel; the full .NET 10 + SignalR + PostgreSQL stack is in the repository.

## Engineering decisions

- **Let the database guard the race.** Mutual exclusion lives in one SQL statement instead of application-level locks.
- **Clear ticket lifecycle.** Ticket states are modelled explicitly so invalid transitions can be rejected and tested.
- **Bilingual from the start.** Thai and English in the interface, the speech announcements and the printed stands.

## Quality and delivery

- xUnit tests for concurrent Call Next and for the ticket state machine
- Angular 19 (Signals, standalone components) front end, .NET 10 Minimal APIs back end, Docker container for the API
`,

  deskflow: `## Overview

**DeskFlow Rooms** is a meeting room booking app for hybrid offices. People reserve rooms across floors, invitees accept or decline in one tap, and everyone sees attendance update live. It targets two common problems: rooms booked and never used, and organisers not knowing who is actually coming.

## What it does

- **Room booking across floors** with floor and zone filters
- **RSVP on every meeting.** Invitees see Accept / Decline, and attendee avatars show accepted, pending or declined status
- **Live headcount** that flags sessions that are under capacity
- **Facility admin** for rooms and floors, including a guard that blocks deleting a floor that still has active rooms
- **Persona switcher** (admin, product lead, standard employee) so a reviewer can see each role without registering

## How it works

1. An Angular 21 front end (Signals and standalone components) talks to .NET 10 Minimal APIs.
2. ASP.NET Core SignalR broadcasts room bookings, RSVP changes and floor changes to every connected client, so there is no polling.
3. Entity Framework Core stores data in SQLite (in memory for the demo, with a reset-to-seed endpoint).
4. The front end is hosted on Vercel and the API in a container on Railway.

## Engineering decisions

- **Signals for UI state.** Room availability and attendee counts are derived with \`signal\` and \`computed\`, which keeps components small.
- **Minimal APIs.** Endpoints are mapped in a few files instead of controller boilerplate.
- **Demo-friendly auth.** The demo uses a persona switcher on purpose; a production version would use single sign-on (OpenID Connect) and role claims, which this project does not implement.

## Limits

- Demo data is seeded and held in memory, so it resets.
- The backend has a test project, but it only contains the default template test.
`,

  equiplend: `## Overview

**EquipLend** is a self-service checkout system for shared IT hardware such as test phones, monitors, docks and VR headsets. It aims to end "who has the dongle?" by making availability visible, forcing returns back through IT, and keeping an audit trail.

## What it does

- **Hardware catalog** with category filters, live search and Available / In use badges
- **Borrow in a few taps**, with a date picker that has duration presets (1 day, 3 days, 1 week, 2 weeks)
- **IT-only returns.** Devices go back to the IT hub so condition is checked before the next person borrows them
- **Waitlist alerts.** Subscribe to a device that is out; get notified when it is returned
- **Admin console** (IT only) for adding and editing devices and viewing the audit trail
- **English / Thai** interface

## How it works

1. A React 19 + Tailwind v4 front end calls .NET 10 Minimal APIs.
2. A background service runs every morning at 09:00 to find overdue loans and send webhook alerts (Slack or Teams style).
3. Every action (borrow, return, waitlist, admin changes) is written to an event ledger shown in the audit trail.
4. Entity Framework Core stores data in SQLite or PostgreSQL; the front end is on Vercel and the API in a container on Railway.

## Engineering decisions

- **Return through one place.** Making IT the single return point keeps the chain of custody simple.
- **Automate the nagging.** The overdue check is a scheduled job, so nobody has to chase devices by hand.
- **Role split.** Employees and IT admins see different screens; the demo lets a reviewer open the admin console directly.

## Limits

- This is a showcase: production sign-in (SSO / OIDC with session tokens) is described in the README as a roadmap item, not built.
- No automated tests are included in the repository yet.
`,

  jodnoi: `## Overview

**Jodnoi** ("จดหน่อย", roughly "jot it down") is a minimal personal finance tracker that works offline and keeps all data on your device. It is built around one goal: logging a transaction in three taps, so people keep doing it.

## What it does

- **Quick add:** tap money out or money in, enter the amount, pick a category, save
- **Your own categories and accounts** (cash, bank, credit card) with custom names, icons and colours
- **History** grouped by day, with edit, delete and undo
- **Dashboard** with income, expense and balance, a daily chart and a category breakdown
- **Backup and export:** JSON backup and restore, plus CSV for Excel or Google Sheets
- **Installable PWA** that works offline and follows the system dark mode

## How it works

1. A React 19 + TypeScript front end stores everything in IndexedDB through Dexie.js. There is no backend, no sign-up and no analytics.
2. Money is stored as integer satang, which avoids floating-point rounding errors.
3. The app asks the browser for persistent storage so data is less likely to be evicted.
4. A service worker (vite-plugin-pwa) caches the app for offline use; static assets are served from Cloudflare Workers.

## Engineering decisions

- **Local-first.** Privacy comes from not having a server at all rather than from promises.
- **Pure logic in \`lib/\`.** Money, dates, summaries and backup code do not touch React or the database, which makes them easy to test.
- **Honest limits.** Clearing browser data deletes the ledger, so the app encourages regular JSON backups.

## Quality and delivery

- Vitest unit tests for the backup and summary logic, with oxlint for linting
- Installable on Android, iOS and desktop; one-tap install prompt and an in-app update prompt
`,
};

async function main() {
  await prisma.profile.update({ where: { id: "default" }, data: { skillsJson: JSON.stringify(skills) } });
  console.log("profile skills updated");

  for (const [slug, contentMarkdown] of Object.entries(caseStudies)) {
    const res = await prisma.project.updateMany({ where: { slug }, data: { contentMarkdown } });
    if (res.count !== 1) throw new Error(`Project not found: ${slug}`);
    console.log(`case study updated: ${slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
