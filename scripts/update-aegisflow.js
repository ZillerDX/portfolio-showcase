// One-off content update for the AegisFlow AI project in prisma/dev.db (prisma/seed.js is stale).
// Source: https://github.com/ZillerDX/ai-document-workflow (Angular 22 rebuild + API hardening, Oct 2026).
// Usage: node scripts/update-aegisflow.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SLUG = "ai-document-workflow";
const DIR = "/uploads/projects/ai-document-workflow";

const content = `## Overview

**AegisFlow AI** is a document approval workflow for invoices, quotations and receipts. A staff member uploads a document, an AI step checks it, a manager approves at level 1, finance approves at level 2, and every step is written to a hash-chained audit ledger. The core rule is segregation of duties: nobody approves their own submission.

## What it does

| Part | What you get |
| :-- | :-- |
| **Inbox** | Opens on "Needs my action" for the current role, with KPIs, queue tabs, search and a type filter |
| **Document page** | Approval progress, AI analysis with an anomaly flag, details with inline correction, line items, history and an action panel |
| **Segregation of duties in the UI** | A user who may not act sees why (for example "Level 1 must be decided by a manager") instead of a disabled button |
| **Upload** | PDF or PNG, or one-click sample presets (clean invoice, tax discrepancy, hardware quote) |
| **Audit ledger** | Every upload, edit and decision is chained; "Verify" walks the chain from the first record to the latest |
| **Responsive** | Collapses to a top bar at tablet width and reflows down to 375px |

## How it works

1. **Roles.** Staff upload and correct fields, a Manager decides level 1, Finance decides level 2, and an Auditor is read-only.
2. **Identity.** In .NET API mode the role and user id come from the signed-in token, never from the request body. Demo login issues a token for one of four seeded personas.
3. **AI check.** With a Gemini key configured, Gemini 2.5 Flash reads the document, extracts line items and compares totals and tax (for example 15% billed vs 7% statutory) before a human sees it.
4. **Audit chain.** Each change adds a record whose SHA-256 hash covers the previous hash plus the record data. The audit record is staged and saved in the same transaction as the change, so the two cannot drift apart.
5. **Two modes.** Run against the .NET 10 + Entity Framework Core + SQLite API, or run browser-only (localStorage and Web Crypto) on GitHub Pages, which is what the live demo uses.

## Engineering decisions

- **The server is the control, the UI is a convenience.** The rules are mirrored in the Angular app for a good experience, and enforced again by the API.
- **Audit written with the change.** Services stage the audit record and the caller saves once, so there is no code path that changes a document without a ledger entry.
- **Honest about the browser demo.** Its hash chain is computed client-side and could be rewritten, so the app shows a warning rather than calling it tamper-proof.
- **Modern Angular.** Angular 22 with standalone components, signals, zoneless change detection and lazy routes.

## Quality and delivery

- xUnit tests for the approval state machine and for security and integrity (segregation of duties, locking, audit chain, concurrency, upload validation)
- Vitest tests for the workflow rules and the browser-mode data layer
- GitHub Actions run a secret scan, the .NET 10 tests and the Angular build with tests; the demo is hosted on GitHub Pages

## Limits

- Demo login is not authentication; a real deployment would put an identity provider in front of the API.
- The browser-only demo keeps data in localStorage, and its hash chain is a demonstration, not a security boundary.
- Uploaded files are sent to Gemini when a key is configured, so confidential documents should not be uploaded to a demo.
`;

const images = [
  ["inbox.webp", "Role-based inbox: Needs my action, KPIs and queue tabs"],
  ["document.webp", "Document page with the AI tax-anomaly flag"],
  ["sod.webp", "Segregation of duties explained in the UI: Finance cannot act on a Level 1 document"],
  ["audit.webp", "Audit ledger with chain verification (dark theme)"],
  ["tablet.webp", "Responsive layout at tablet width"],
];

async function main() {
  const project = await prisma.project.findUnique({ where: { slug: SLUG } });
  if (!project) throw new Error(`Project ${SLUG} not found`);

  await prisma.project.update({
    where: { id: project.id },
    data: {
      title: "AegisFlow AI: Document Workflow with Audit Proof",
      summary:
        "Two-level document approval with segregation of duties enforced by the API, Gemini tax-mismatch checks and a SHA-256 audit ledger. Angular 22, .NET 10.",
      contentMarkdown: content,
      coverImage: `${DIR}/cover.webp`,
      tagsJson: JSON.stringify(["Angular 22", ".NET 10", "Gemini", "SHA-256", "C#", "SQLite", "xUnit", "Vitest"]),
      projectDate: "2026-10",
    },
  });

  await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
  await prisma.projectImage.createMany({
    data: images.map(([file, caption], i) => ({ projectId: project.id, imageUrl: `${DIR}/${file}`, caption, sortOrder: i + 1 })),
  });

  console.log("AegisFlow AI updated: text, tags, cover, 5 gallery images.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
