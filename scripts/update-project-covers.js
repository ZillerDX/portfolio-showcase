// One-off content update for prisma/dev.db (prisma/seed.js is stale): new cover thumbnails plus
// factual titles/summaries checked against each project's README (Oct 2026).
// Covers come from scripts/covers/build-covers.js. Usage: node scripts/update-project-covers.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const projects = {
  queueflow: {
    title: "QueueFlow: Real-Time Queue Management",
    summary:
      "Customers take a ticket on their phone, staff call the next number, and a TV board shows the queue live. .NET 10, Angular 19, SignalR, PostgreSQL SKIP LOCKED.",
  },
  deskflow: {
    title: "DeskFlow Rooms: Meeting Room Booking with Live RSVP",
    summary:
      "Book meeting rooms across floors; invitees accept or decline and attendance syncs live. .NET 10 Minimal APIs, Angular 21 Signals, SignalR.",
  },
  equiplend: {
    title: "EquipLend: Internal IT Asset Checkout",
    summary:
      "Self-service checkout for shared IT devices with live availability, IT-only returns, waitlist alerts and an audit trail. .NET 10, React 19, Tailwind.",
  },
  jodnoi: {
    title: "Jodnoi: Offline-First Personal Finance PWA",
    summary:
      "Log income and expenses in 3 taps; data stays on your device. React 19, TypeScript, Dexie (IndexedDB), Cloudflare Workers.",
  },
  "optitrack-wms": {
    title: "OptiTrack WMS: Warehouse Management with AI Copilot",
    summary:
      "Live zone capacity and inventory ledger, an AI copilot with 7-day stockout forecasts, and one-click draft purchase orders. Next.js, FastAPI.",
    contentMarkdown: `## Overview

**OptiTrack WMS** is a warehouse management system for stock visibility, space planning and replenishment. It combines a live inventory ledger and zone capacity meters with an AI copilot that forecasts stockouts and drafts purchase orders.

### Highlights
- Zone capacity distribution (Fast Flow, High-Bay Racks, Cold Vault, Staging Area) with click-to-filter
- AI copilot: 30-day stock velocity, days of inventory, 7-day stockout risk and itemized draft purchase orders
- AI provider failover across Gemini and Groq with a rule-based fallback, so it works without an API key
- Executive dashboard: inbound vs outbound trend, category distribution and a replenishment queue
- Next.js and TypeScript front end, FastAPI (Python) back end, PostgreSQL, Redis and Docker Compose
`,
  },
  "ai-document-workflow": {
    title: "AegisFlow AI: Document Workflow with Audit Proof",
    summary:
      "Document approval with segregation of duties by role, Gemini OCR that flags tax mismatches, and a SHA-256 hash-chained audit ledger. .NET 10, Angular.",
    contentMarkdown: `## Overview

**AegisFlow AI** is a document approval workflow with strict segregation of duties and a tamper-evident audit trail.

### Highlights
- Role-based approval flow (staff, manager, finance, auditor) so nobody approves their own submission
- Gemini multimodal OCR extracts invoice fields and flags tax mismatches (for example 15% billed vs 7% statutory)
- SHA-256 forward-chained audit ledger (previous hash to record hash) with one-click chain verification
- Light and dark themes, responsive down to tablet width
- .NET 10 / C# 14 back end with an Angular front end
`,
  },
  "math-generative-art-studio": {
    title: "Axiom: Generative Math and GPU Shader Studio",
    summary:
      "A WebGL2 shader lab that turns math formulas into real-time GPU visuals, with KaTeX equations and shareable state. TypeScript, React, GLSL.",
  },
  "ml-model-playground": {
    title: "ML Playground: In-Browser Machine Learning Lab",
    summary:
      "Interactive ML lab that runs entirely in the browser: gradient descent, decision boundaries and k-means with TensorFlow.js, React and TypeScript.",
  },
  "globepass-visa": {
    title: "GlobePass: Visa and Consular Intelligence",
    summary:
      "Bilingual (TH/EN) visa guide covering 199 countries and 39,601 country pairs, with Gemini-written checklists and an offline fallback. Next.js, FastAPI.",
    contentMarkdown: `## Overview

**GlobePass** helps travellers check visa rules before they book: pick a passport and a destination to see visa classification, stay limits, processing windows and fees.

### Highlights
- 199 countries and 39,601 bilateral country pairs
- Bilingual Thai / English interface, responsive down to a 375px viewport
- Gemini 2.5 Flash writes checklists and roadmaps on demand, with a deterministic offline fallback when the AI is unavailable
- Next.js front end with a FastAPI (Python) back end
`,
  },
  "qr-menu-easy-order": {
    title: "Cafe Order: QR Menu and Kitchen Display",
    summary:
      "Zero-install QR menu for diners with a live kitchen display, printable table QR stands and sales analytics. React, TypeScript, Supabase.",
  },
};

async function main() {
  for (const [slug, data] of Object.entries(projects)) {
    const res = await prisma.project.updateMany({
      where: { slug },
      data: { ...data, coverImage: `/uploads/projects/${slug}/cover.webp` },
    });
    if (res.count !== 1) throw new Error(`Project not found: ${slug}`);
    console.log(`updated ${slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
