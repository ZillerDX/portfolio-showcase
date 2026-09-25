const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding portfolio database with authentic data for Tanathon Chanapha (ZillerDX)...");

  // 1. Clear existing data
  await prisma.certificate.deleteMany({});
  await prisma.projectLink.deleteMany({});
  await prisma.projectImage.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.profile.deleteMany({});

  // 2. Seed Profile
  const skillsData = [
    {
      category: "Frontend & UI Systems",
      skills: [
        { name: "Next.js 14/15" },
        { name: "React 18/19" },
        { name: "Angular 19" },
        { name: "TypeScript" },
        { name: "Tailwind CSS" },
        { name: "Flutter & Dart" },
        { name: "Recharts & Data Viz" },
      ],
    },
    {
      category: "Backend & Distributed Systems",
      skills: [
        { name: ".NET 10 Minimal APIs" },
        { name: "C# 14" },
        { name: "Node.js & Express" },
        { name: "Python & FastAPI" },
        { name: "Go (Golang)" },
        { name: "REST & WebSockets" },
        { name: "WebCrypto SHA-256" },
      ],
    },
    {
      category: "Database & Cloud Infrastructure",
      skills: [
        { name: "Supabase" },
        { name: "PostgreSQL" },
        { name: "SQLite & LibSQL" },
        { name: "Prisma ORM" },
        { name: "Docker" },
        { name: "Vercel & Railway" },
        { name: "GitHub Pages / CI/CD" },
      ],
    },
    {
      category: "Architecture & AI Practices",
      skills: [
        { name: "Waterfall SDLC" },
        { name: "Test-Driven Development (TDD)" },
        { name: "Autonomous AI Agents" },
        { name: "SCADA Digital Twins" },
        { name: "Clean Architecture" },
        { name: "Design Systems & WCAG" },
      ],
    },
  ];

  await prisma.profile.create({
    data: {
      id: "default",
      name: "Tanathon Chanapha",
      title: "Full-Stack & Systems Architect | Software Engineer",
      bio: "Engineering high-performance enterprise systems, autonomous AI agents, digital twin platforms, and modern web architectures with disciplined software craft.",
      avatarUrl: "/uploads/images/avatar.png",
      resumePdfUrl: "/uploads/documents/alex-chen-resume.pdf",
      availableForWork: true,
      availabilityText: "Available for high-impact software engineering & architecture opportunities",
      contactEmail: "chanapha.tanathon@gmail.com",
      githubUrl: "https://github.com/ZillerDX",
      linkedinUrl: "https://linkedin.com/in/tanathon-chanapha",
      twitterUrl: "https://twitter.com/ZillerDX",
      location: "Bangkok, Thailand (UTC+7)",
      skillsJson: JSON.stringify(skillsData),
    },
  });

  // 3. Seed Categories
  const catEnterprise = await prisma.category.create({
    data: { name: "Enterprise Systems", slug: "enterprise-systems", sortOrder: 1 },
  });
  const catWeb = await prisma.category.create({
    data: { name: "Web Applications", slug: "web-apps", sortOrder: 2 },
  });
  const catAi = await prisma.category.create({
    data: { name: "AI & Data Platforms", slug: "ai-data", sortOrder: 3 },
  });
  const catMobile = await prisma.category.create({
    data: { name: "Mobile & Offline-First", slug: "mobile", sortOrder: 4 },
  });

  // 4. Seed Projects
  // Project 1: QueueFlow
  const pQueueflow = await prisma.project.create({
    data: {
      title: "QueueFlow — Enterprise Real-Time Distributed Queue Management System",
      slug: "queueflow",
      summary: "High-throughput real-time distributed queue management and counter dispatch platform engineered with .NET 10 LTS Minimal APIs, Angular 19 Standalone Signals, SignalR WebSockets, and PostgreSQL SKIP LOCKED pessimistic concurrency.",
      categoryId: catEnterprise.id,
      coverImage: "/uploads/projects/queueflow/preview.png",
      tagsJson: JSON.stringify([".NET 10", "C# 14", "Angular 19", "SignalR", "PostgreSQL", "WebSockets", "Tailwind CSS", "PWA"]),
      isFeatured: true,
      isPublished: true,
      sortOrder: 1,
      projectDate: "2026-09",
      contentMarkdown: `## Executive Overview

**QueueFlow** is an enterprise-grade distributed real-time queue and service counter management platform engineered for multi-branch organizations (clinics, banking halls, service centers, and public sector offices). It eliminates waiting room congestion, human triage delays, and ticket collisions through synchronized digital queue tracking.

Built with **.NET 10 LTS (C# 14 Minimal APIs)** on the backend and **Angular 19 (Signals & Standalone Single-File Components)** on the frontend, QueueFlow showcases high-concurrency architecture with PostgreSQL row-level locks and sub-millisecond SignalR WebSocket broadcasts.

---

## Architectural Pillars

\`\`\`
Client Architecture      Angular 19 Standalone SFC + Signals State + Tailwind CSS v4 (PWA)
Real-Time Engine         ASP.NET Core SignalR WebSockets + BroadcastChannel Event Stream
Backend Framework        .NET 10 LTS Minimal APIs + C# 14 (Native OpenAPI 3.1)
Concurrency Control      PostgreSQL 18 (SELECT ... FOR UPDATE SKIP LOCKED)
Data Persistence         Entity Framework Core + PostgreSQL Relational Storage
Deployment Pipeline      Vercel Edge (Frontend PWA) + Docker Container (.NET 10 API)
\`\`\`

### 1. Zero-Friction Mobile Intake & Live Digital Pass
- **Scan & Join**: Customers scan dynamic counter QR codes to join queues with zero app downloads or account creation.
- **Real-Time Tracker**: Sub-second position countdown, estimated wait times (EWT), and turn-alert notifications via WebSockets.
- **Print-Ready QR Standees**: In-app generation of A4 tent standees and counter signage for triage desks.

### 2. Double-Call Race Condition Immunity (SKIP LOCKED)
- High-velocity service centers with multiple tellers clicking "Call Next" simultaneously are protected at the database engine level via PostgreSQL \`SELECT ... FOR UPDATE SKIP LOCKED\`.
- Ensures absolute mutual exclusion with zero duplicate ticket assignments across concurrent counter requests.

### 3. TV Signage & Multi-Desk Staff Terminals
- **16:9 Public Display**: Live board with bilingual audio chimes (Web Audio API & Web Speech API) in Thai and English.
- **Staff Operations Terminal**: One-click ticket calling, recalls, transfers, no-show flagging, and multi-service bindings.
- **Branch Management**: Centralized counter assignment, service letter prefix configuration (A/B/C), and throughput analytics.
`,
      links: {
        create: [
          { label: "Live Demo (Vercel)", url: "https://queueflow-wheat.vercel.app", type: "live" },
          { label: "GitHub Repository", url: "https://github.com/ZillerDX/QueueFlow", type: "github" },
        ],
      },
      images: {
        create: [
          { imageUrl: "/uploads/projects/queueflow/preview.png", caption: "QueueFlow Customer Intake Portal & Instant Mobile Pass", sortOrder: 1 },
          { imageUrl: "/uploads/projects/queueflow/ticket-tracker.png", caption: "Real-Time Digital Ticket Tracker & Position Countdown", sortOrder: 2 },
          { imageUrl: "/uploads/projects/queueflow/staff-terminal.png", caption: "Multi-Desk Staff Service Terminal & Atomic Queue Calling", sortOrder: 3 },
          { imageUrl: "/uploads/projects/queueflow/tv-display.png", caption: "16:9 Public TV Digital Signage with Real-Time Audio Chime", sortOrder: 4 },
          { imageUrl: "/uploads/projects/queueflow/admin-management.png", caption: "Branch Counter Configuration & Service Desk Management", sortOrder: 5 },
          { imageUrl: "/uploads/projects/queueflow/qr-standee-modal.png", caption: "Print-Ready A4 Desk Standee & Entrance QR Generator", sortOrder: 6 },
        ],
      },
    },
  });

  // Project 2: DeskFlow Rooms
  const pDeskflow = await prisma.project.create({
    data: {
      title: "DeskFlow Rooms — Enterprise Workplace Collaboration & Meeting Operating System",
      slug: "deskflow",
      summary: "High-performance real-time meeting room reservation and workplace facility system for hybrid enterprises, engineered with .NET 10 LTS Minimal APIs, Angular 21 Standalone Signals, and SignalR WebSockets bi-directional attendance synchronization.",
      categoryId: catEnterprise.id,
      coverImage: "/uploads/projects/deskflow/overview.png",
      tagsJson: JSON.stringify([".NET 10", "C# 14", "Angular 21", "SignalR", "WebSockets", "EF Core", "Tailwind CSS"]),
      isFeatured: true,
      isPublished: true,
      sortOrder: 2,
      projectDate: "2026-09",
      contentMarkdown: `## Executive Overview

**DeskFlow Rooms** is an enterprise workplace collaboration and meeting room operating system engineered for modern hybrid enterprises. The system addresses ghost bookings, meeting quorum opacity, and multi-floor corporate tower navigation through sub-second bi-directional attendance synchronization and lightweight facility governance.

Built with **.NET 10 LTS (C# 14 Minimal APIs)** on the backend and **Angular 21 (Signals & Standalone Single-File Components)** on the frontend, DeskFlow demonstrates disciplined modern full-stack software craftsmanship with zero component sprawl.

---

## Architectural Pillars

\`\`\`
Client Architecture      Angular 21 Standalone SFC + Signals State + Tailwind CSS
Real-Time Engine         ASP.NET Core SignalR WebSockets (Bi-directional Broadcasting)
Backend Framework        .NET 10 LTS Minimal APIs + C# 14 (Native OpenAPI 3.1)
Data Persistence         Entity Framework Core + SQLite / PostgreSQL (Relational Integrity)
Deployment Pipeline      Vercel (Frontend Edge) + Railway (Containerized .NET 10 API)
\`\`\`

### 1. High-Precision State Management with Angular Signals
- **Zero RxJS Memory Leaks**: Utilizes fine-grained Angular \`signal\`, \`computed\`, and \`effect\` primitives for reactive room availability and attendee counts.
- **Single-File Standalone Components (SFC)**: Unified component structure combining HTML templates, SCSS tokens, and TypeScript logic in streamlined single-file modules.
- **Defensive UI/UX**: Zero layout shifts with skeleton placeholders, semantic vector icons, and instant visual state transitions.

### 2. .NET 10 LTS & C# 14 Minimal APIs
- **Token-Lean Backend**: Highly concise, single-file endpoint mapping avoiding 15-file controller boilerplate.
- **C# 14 Features**: Leverages modern C# 14 field-backed properties and native OpenAPI 3.1 documentation endpoints.
- **ASP.NET Core SignalR**: Broadcasts real-time room reservations, RSVP responses, cancellations, and floor mutations across all active clients in sub-50ms latency.
`,
      links: {
        create: [
          { label: "Live Demo (Vercel)", url: "https://deskflow-three-mauve.vercel.app/", type: "live" },
          { label: "GitHub Repository", url: "https://github.com/ZillerDX/deskflow", type: "github" },
        ],
      },
      images: {
        create: [
          { imageUrl: "/uploads/projects/deskflow/overview.png", caption: "DeskFlow Rooms Executive Dashboard & Live Attendance Status", sortOrder: 1 },
          { imageUrl: "/uploads/projects/deskflow/employee-view.png", caption: "Employee Persona Perspective & 1-Click Meeting RSVP Workflow", sortOrder: 2 },
          { imageUrl: "/uploads/projects/deskflow/rsvp-accepted.png", caption: "Real-Time Bi-Directional RSVP Status Synchronization via SignalR", sortOrder: 3 },
          { imageUrl: "/uploads/projects/deskflow/manage-floors.png", caption: "Multi-Floor Facility Administration & Conflict Governance", sortOrder: 4 },
          { imageUrl: "/uploads/projects/deskflow/add-room.png", caption: "Room Specifications, Seat Quota & Hardware Provisioning Modal", sortOrder: 5 },
        ],
      },
    },
  });

  // Project 3: EquipLend (Enterprise Hardware Checkout System)
  const pEquiplend = await prisma.project.create({
    data: {
      title: "EquipLend — Internal Device & IT Asset Checkout Kiosk",
      slug: "equiplend",
      summary: "High-efficiency workplace hardware custody platform engineered with .NET 10 LTS Minimal APIs, React 19, and Tailwind CSS tokens, featuring automated 09:00 AM overdue notifications, screen-centered date pickers, and tamper-evident IT operations logs.",
      categoryId: catEnterprise.id,
      coverImage: "/uploads/projects/equiplend/hero-preview.png",
      tagsJson: JSON.stringify([".NET 10", "C# 14", "React 19", "Tailwind CSS", "Minimal APIs", "EF Core", "Bilingual i18n"]),
      isFeatured: true,
      isPublished: true,
      sortOrder: 3,
      projectDate: "2026-09",
      contentMarkdown: `## Executive Overview

**EquipLend** is an internal workplace hardware lending and IT asset checkout kiosk engineered to eradicate asset drift, untracked peer-to-peer hardware handovers, and manual inventory follow-ups in engineering and corporate offices.

Built with **.NET 10 LTS (C# 14 Minimal APIs)** on the backend and **React 19 + Tailwind CSS tokens** on the frontend, EquipLend delivers a friction-free self-service hardware catalog with automated morning overdue recovery and role-segregated IT administrative audit trails.

---

## Architectural Pillars

\`\`\`
Client Architecture      React 19 + Tailwind CSS Tokens (Vercel Edge Deployment)
Backend Framework        .NET 10 LTS Minimal APIs + C# 14 (Railway Cloud)
Autonomous Worker        C# BackgroundService (09:00 AM Overdue Scheduler)
Data Persistence         Entity Framework Core + SQLite / PostgreSQL Relational Storage
Localization Engine      Bilingual Reactive Engine (English & ภาษาไทย)
\`\`\`

### 1. Zero-Training Self-Service UX
- **Intuitive Hardware Catalog**: Instant category categorization (Laptops, Mobile Test Devices, Monitors & Docks, Adapters & Cables, XR/VR R&D, Tablets) with live text search.
- **Visual Availability Badging**: Real-time status indicators (\`Available\` with emerald vector indicator, \`In Use\` with high-contrast red indicator).
- **Return to Central IT Governance**: Enforces physical hardware inspection at the central IT hub before re-issuance, safely preserving chain-of-custody.

### 2. .NET 10 LTS Backend & Background Automation
- **Autonomous Overdue Scheduler**: Integrated .NET 10 \`BackgroundService\` scans borrow ledgers every morning at 09:00 AM, automatically triggering overdue alerts and webhook dispatches.
- **IT Operations & Audit Trail**: Chronological event ledger recording every action (\`BORROW\`, \`RETURN\`, \`WATCHLIST_SUBSCRIBED\`, \`ADMIN_CREATE_DEVICE\`, \`ADMIN_UPDATE_DEVICE\`, \`ADMIN_DELETE_DEVICE\`).
- **Screen-Centered Date Picker**: Custom-built modal calendar with instant duration presets (1 Day, 3 Days, 1 Week, 2 Weeks) and affirmative confirmation.
`,
      links: {
        create: [
          { label: "Live Demo (Vercel)", url: "https://equiplend.vercel.app/", type: "live" },
          { label: "GitHub Repository", url: "https://github.com/ZillerDX/equiplend", type: "github" },
        ],
      },
      images: {
        create: [
          { imageUrl: "/uploads/projects/equiplend/hero-preview.png", caption: "EquipLend Equipment Catalog & Modern Kiosk Interface", sortOrder: 1 },
          { imageUrl: "/uploads/projects/equiplend/datepicker-preview.png", caption: "Screen-Centered Modern Date Picker Modal with Quick Presets", sortOrder: 2 },
          { imageUrl: "/uploads/projects/equiplend/admin-preview.png", caption: "IT Administrator Console & Operations Audit Ledger", sortOrder: 3 },
          { imageUrl: "/uploads/projects/equiplend/logo.png", caption: "EquipLend Internal IT Asset Kiosk Brand Emblem", sortOrder: 4 },
        ],
      },
    },
  });

  // Project 4: OptiTrack WMS (Flagship Project)
  const pOptitrack = await prisma.project.create({
    data: {
      title: "OptiTrack WMS — Intelligent Warehouse Management System & Digital Twin",
      slug: "optitrack-wms",
      summary: "Enterprise warehouse operations platform featuring 2D/3D digital twin heatmaps, autonomous AI replenishment velocity analysis, real-time transaction ledgers, and executive intelligence reporting.",
      categoryId: catEnterprise.id,
      coverImage: "/uploads/images/optitrack-command-center.png",
      pdfFile: "/uploads/documents/apex-whitepaper.pdf",
      tagsJson: JSON.stringify(["Next.js 14", "TypeScript", "Supabase", "FastAPI", "Tailwind CSS", "Recharts", "AI Operations", "SCADA"]),
      isFeatured: true,
      isPublished: true,
      sortOrder: 4,
      projectDate: "2026-05 - Present",
      contentMarkdown: `## Executive Overview

**OptiTrack WMS** is an enterprise-grade warehouse operations platform engineered for precision stock visibility, space optimization, and autonomous inventory replenishment. It bridges physical warehouse floor operations with executive analytics through real-time SCADA digital twins and autonomous AI intelligence.

### Core Architectural Pillars

1. **Warehouse Command Center & Real-Time Analytics**:
   - Live telemetry synthesizing Total Catalog SKUs, Gross Retail Valuation, and Inbound/Outbound unit volume.
   - Interactive stock movement velocity tracking with multi-location zone capacity distribution (Zone A, Zone B, Cold Storage).
   - One-click AI operations intelligence diagnostics.

2. **2D CAD Blueprint & 3D Isometric Digital Twin**:
   - Multi-tier industrial pallet racks (Ground Heavy T1, Pick-Level T2, High-Bay T3) with real-time density heatmaps (0% Empty to >90% Critical).
   - Interactive rack inspection drawer, live SKU spotlighting, and quick inbound routing.

3. **Autonomous AI Predictive Inventory & Reorder Engine**:
   - Evaluates 30-day outbound velocity (V = Outbound / 30) and Days of Inventory (DOI) run-out timelines.
   - Generates automated Draft Purchase Orders (POs) with recommended quantities.
   - **1-Click PO Approval Workflow**: Records POs in Supabase, atomically logs INBOUND transactions, and updates stock balances.

4. **Auditable Warehouse Transaction Ledger**:
   - Immutable, auditable ledger tracking every single stock movement (INBOUND, OUTBOUND, ADJUST) with reference code tags, timestamps, operator signatures, and monetary amounts.
   - Instant filtering by transaction type and CSV/Excel export for fiscal audits.

5. **Security & Role-Based Access Control**:
   - Multi-tenant architecture with JWT token validation, role-based permissions (Warehouse Admin, Floor Operator, Executive Auditor), and secure OAuth/Email authentication.
`,
    },
  });

  await prisma.projectImage.createMany({
    data: [
      {
        projectId: pOptitrack.id,
        imageUrl: "/uploads/images/optitrack-command-center.png",
        caption: "Warehouse Command Center: Live operational overview, stock velocity, valuation ($63,850), and zone capacity distribution.",
        sortOrder: 1,
      },
      {
        projectId: pOptitrack.id,
        imageUrl: "/uploads/images/optitrack-transactions-ledger.png",
        caption: "Warehouse Transaction Ledger: Auditable inbound deliveries ($85,800) and outbound dispatches ($19,750) with reference codes.",
        sortOrder: 2,
      },
      {
        projectId: pOptitrack.id,
        imageUrl: "/uploads/images/optitrack-ai-report.png",
        caption: "AI Operations Intelligence Report: Autonomous warehouse health score (Grade A 90/100), SKU velocity, and run-rate diagnostics.",
        sortOrder: 3,
      },
      {
        projectId: pOptitrack.id,
        imageUrl: "/uploads/images/optitrack-auth-signin.png",
        caption: "OptiTrack Warehouse OS: Enterprise sign-in portal with role-based access control and demo account presets.",
        sortOrder: 4,
      },
    ],
  });

  await prisma.projectLink.createMany({
    data: [
      {
        projectId: pOptitrack.id,
        label: "Live Production",
        url: "https://optitrackwms.vercel.app",
        type: "demo",
      },
      {
        projectId: pOptitrack.id,
        label: "GitHub Repository",
        url: "https://github.com/ZillerDX/Optitrack-WMS",
        type: "github",
      },
    ],
  });

  // Project 5: CodePulse — Autonomous AI Codebase Intelligence
  const pCodepulse = await prisma.project.create({
    data: {
      title: "CodePulse — Autonomous AI Codebase Intelligence & Architecture Telemetry",
      slug: "ai-codebase-intelligence",
      summary: "Autonomous AI codebase intelligence and architecture telemetry platform (.NET 10 + Angular 19) providing real-time AST structural scanning, dependency drift detection, and health scorecards.",
      categoryId: catAi.id,
      coverImage: "/uploads/images/project-synapse.svg",
      pdfFile: "/uploads/documents/synapse-system-design.pdf",
      tagsJson: JSON.stringify([".NET 10", "C# 14", "Angular 19", "TypeScript", "AST Analysis", "Tailwind CSS", "GitHub Pages"]),
      isFeatured: false,
      isPublished: true,
      sortOrder: 5,
      projectDate: "2026-09",
      contentMarkdown: `## Project Overview

**CodePulse** is an automated architectural telemetry system that inspects software repositories to extract dependency graphs, measure architectural drift, and verify code health using high-speed AST parsers.

### Technical Highlights
- **.NET 10 Minimal APIs Backend**: Ultra-fast execution times, zero-allocation serialization, and minimal memory footprint.
- **Angular 19 Standalone Architecture**: Signal-based reactive state with zero unnecessary re-renders.
- **Live AST Inspection**: Maps components, endpoints, and database models to prevent schema divergence.`,
    },
  });

  await prisma.projectLink.createMany({
    data: [
      {
        projectId: pCodepulse.id,
        label: "GitHub Repository",
        url: "https://github.com/ZillerDX/ai-codebase-intelligence",
        type: "github",
      },
    ],
  });

  // Project 6: AI Document Workflow & Segregation of Duties Engine
  const pDocWorkflow = await prisma.project.create({
    data: {
      title: "AI Document Workflow & Segregation of Duties Engine",
      slug: "ai-document-workflow",
      summary: "Enterprise-grade document workflow with automated segregation of duties, cryptographic SHA-256 verification, and compliance approval chains built on .NET 10 and Angular 19.",
      categoryId: catEnterprise.id,
      coverImage: "/uploads/images/project-prism.svg",
      pdfFile: "/uploads/documents/prism-design-specs.pdf",
      tagsJson: JSON.stringify([".NET 10", "C# 14", "Angular 19", "WebCrypto SHA-256", "TypeScript", "Tailwind CSS", "Compliance"]),
      isFeatured: false,
      isPublished: true,
      sortOrder: 6,
      projectDate: "2026-09",
      contentMarkdown: `## Project Overview

An enterprise compliance engine designed to prevent financial and operational fraud by enforcing strict Segregation of Duties (SoD) policies. Every document action is cryptographically signed using WebCrypto SHA-256 hashes and timestamped on an auditable ledger.`,
    },
  });

  await prisma.projectLink.createMany({
    data: [
      {
        projectId: pDocWorkflow.id,
        label: "GitHub Repository",
        url: "https://github.com/ZillerDX/ai-document-workflow",
        type: "github",
      },
    ],
  });

  // Project 4: Subscription Graveyard
  const pSubGraveyard = await prisma.project.create({
    data: {
      title: "Subscription Graveyard — Recurring Expense Tracker & Optimization",
      slug: "subscription-graveyard",
      summary: "Modern financial telemetry platform designed to track, analyze, and optimize recurring SaaS and consumer subscriptions, highlighting zombie costs and renewal spikes.",
      categoryId: catWeb.id,
      coverImage: "/uploads/images/project-pulse.svg",
      pdfFile: "/uploads/documents/pulse-architecture.pdf",
      tagsJson: JSON.stringify(["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma ORM", "Tailwind CSS"]),
      isFeatured: true,
      isPublished: true,
      sortOrder: 4,
      projectDate: "2025-11",
      contentMarkdown: `## Project Overview

A consumer finance platform that gives users total visibility over their subscription commitments. Features automated currency normalization, price increase detection, and renewal calendar alerts.`,
    },
  });

  await prisma.projectLink.createMany({
    data: [
      {
        projectId: pSubGraveyard.id,
        label: "GitHub Repository",
        url: "https://github.com/ZillerDX/Subscription-Graveyard",
        type: "github",
      },
    ],
  });

  // Project 5: Waterfall SDLC Skill for AI Agents
  const pWaterfall = await prisma.project.create({
    data: {
      title: "Waterfall SDLC Skill — Quality-Gated 7-Phase Engineering for AI Agents",
      slug: "waterfall-sdlc-skill",
      summary: "Disciplined 7-phase quality-gate lifecycle framework for autonomous AI coding agents (Antigravity, Claude Code, Cursor, Codex). Enforces: No coding before design sign-off.",
      categoryId: catWeb.id,
      coverImage: "/uploads/images/profile-banner.svg",
      tagsJson: JSON.stringify(["SDLC", "Software Engineering", "AI Architecture", "HTML5", "Tailwind CSS", "Quality Gates"]),
      isFeatured: false,
      isPublished: true,
      sortOrder: 5,
      projectDate: "2026-09",
      contentMarkdown: `## Project Overview

Waterfall SDLC is a structured process framework designed to make AI coding agents reliable on large-scale, mission-critical codebases. By mandating rigorous Requirements Analysis, Architectural Design Blueprints, and explicit Quality Gate sign-offs, it prevents code regressions and architectural drift.`,
    },
  });

  await prisma.projectLink.createMany({
    data: [
      {
        projectId: pWaterfall.id,
        label: "Live Documentation",
        url: "https://zillerdx.github.io/waterfall-sdlc-skill/",
        type: "demo",
      },
      {
        projectId: pWaterfall.id,
        label: "GitHub Repository",
        url: "https://github.com/ZillerDX/waterfall-sdlc-skill",
        type: "github",
      },
    ],
  });

  // Project 6: QR-Menu Easy Order
  const pQrMenu = await prisma.project.create({
    data: {
      title: "QR-Menu Easy Order — Local-First Restaurant Operating System",
      slug: "qr-menu-easy-order",
      summary: "Responsive, local-first restaurant management and dine-in self-ordering web application connecting customer tables directly with kitchen production screens in real time.",
      categoryId: catMobile.id,
      coverImage: "/uploads/images/project-apex.svg",
      tagsJson: JSON.stringify(["React", "TypeScript", "Tailwind CSS", "Supabase", "PWA", "WebSockets"]),
      isFeatured: false,
      isPublished: true,
      sortOrder: 6,
      projectDate: "2026-08",
      contentMarkdown: `## Project Overview

A frictionless dining app allowing restaurant patrons to scan dynamic QR codes, browse categorized menus with real-time availability, and dispatch orders straight to the chef line without app store installation.`,
    },
  });

  await prisma.projectLink.createMany({
    data: [
      {
        projectId: pQrMenu.id,
        label: "GitHub Repository",
        url: "https://github.com/ZillerDX/QR-Menu-Easy-Order",
        type: "github",
      },
    ],
  });

  // Project 7: GlobePass Visa
  const pGlobePass = await prisma.project.create({
    data: {
      title: "GlobePass — Global Visa & Consular AI Intelligence Platform",
      slug: "globepass-visa",
      summary: "Bilingual (Thai/English) consular intelligence platform mapping worldwide visa requirements, entry regulations, and AI-assisted eligibility assessments across 227 countries.",
      categoryId: catAi.id,
      coverImage: "/uploads/images/project-synapse.svg",
      tagsJson: JSON.stringify(["TypeScript", "React", "Next.js", "Python", "FastAPI", "Tailwind CSS"]),
      isFeatured: false,
      isPublished: true,
      sortOrder: 7,
      projectDate: "2026-09",
      contentMarkdown: `## Project Overview

An international mobility platform giving global travelers verified consular rules, embassy document checklists, and visa-free travel matrices with automated policy monitoring.`,
    },
  });

  await prisma.projectLink.createMany({
    data: [
      {
        projectId: pGlobePass.id,
        label: "GitHub Repository",
        url: "https://github.com/ZillerDX/globepass-visa",
        type: "github",
      },
    ],
  });

  // Project 8: MicroSME
  const pMicroSME = await prisma.project.create({
    data: {
      title: "MicroSME — Point of Sale & Business Management Platform",
      slug: "microsme-pos",
      summary: "Comprehensive Point of Sale (POS) and inventory management platform designed for micro-enterprises and retail shops with seamless offline caching.",
      categoryId: catMobile.id,
      coverImage: "/uploads/images/project-pulse.svg",
      tagsJson: JSON.stringify(["Flutter", "Dart", "SQLite", "Mobile POS", "Cross-Platform"]),
      isFeatured: false,
      isPublished: true,
      sortOrder: 8,
      projectDate: "2025-10",
      contentMarkdown: `## Project Overview

A lightweight, robust Point of Sale system built on Flutter and Dart, supporting barcode scanning, thermal receipt printing, and instant offline sales recording.`,
    },
  });

  await prisma.projectLink.createMany({
    data: [
      {
        projectId: pMicroSME.id,
        label: "GitHub Repository",
        url: "https://github.com/ZillerDX/MicroSME",
        type: "github",
      },
    ],
  });

  // 5. Seed Verified Certifications
  console.log("Seeding certificates...");
  await prisma.certificate.createMany({
    data: [
      {
        title: "Responsible Use of Artificial Intelligence",
        issuer: "Krones AG (Germany)",
        issueDate: "15. June 2026",
        credentialId: "KRONES-AI-2026-0615",
        credentialUrl: "https://www.krones.com",
        fileUrl: "/uploads/documents/krones-responsible-ai.pdf",
        description: "Certified competency in the ethical deployment, regulatory compliance, and responsible integration of Artificial Intelligence systems within industrial enterprise environments. Covers AI bias prevention, transparency, data accountability, and safe operational guidelines.",
        skillsJson: JSON.stringify(["Responsible AI", "AI Ethics & Governance", "Data Integrity", "Enterprise AI Safety", "Risk Mitigation"]),
        sortOrder: 1,
        isFeatured: true,
      },
      {
        title: "M365 Copilot Chat: Your Smart Assistant at Work",
        issuer: "Krones AG (Germany)",
        issueDate: "15. June 2026",
        credentialId: "KRONES-M365-2026-0615",
        credentialUrl: "https://www.krones.com",
        fileUrl: "/uploads/documents/krones-m365-copilot.pdf",
        description: "Practical mastery in leveraging Microsoft 365 Copilot for intelligent workflow automation, generative reasoning, context-aware information synthesis, and enterprise productivity enhancement.",
        skillsJson: JSON.stringify(["Microsoft 365 Copilot", "Generative AI", "Enterprise Automation", "Prompt Engineering", "Digital Productivity"]),
        sortOrder: 2,
        isFeatured: true,
      },
      {
        title: "Instruction Cyber Security, Data Protection",
        issuer: "Krones AG (Germany)",
        issueDate: "13. March 2026",
        credentialId: "KRONES-SEC-2026-0313",
        credentialUrl: "https://www.krones.com",
        fileUrl: "/uploads/documents/krones-cybersecurity-data-protection.pdf",
        description: "Comprehensive certification covering technical cyber defense protocols, organizational data protection, GDPR compliance, social engineering mitigation, secure credential hygiene, and industrial information asset protection.",
        skillsJson: JSON.stringify(["Cyber Security", "Data Protection (GDPR)", "Information Security", "Threat Prevention", "Access Control"]),
        sortOrder: 3,
        isFeatured: true,
      },
      {
        title: "Compliance e-Learning",
        issuer: "Krones AG (Germany)",
        issueDate: "13. March 2026",
        credentialId: "KRONES-COMP-2026-0313",
        credentialUrl: "https://www.krones.com",
        fileUrl: "/uploads/documents/krones-compliance.pdf",
        description: "Formal corporate compliance certification upholding international business ethics, anti-corruption standards, fair competition practices, and strict adherence to German & European corporate regulatory frameworks.",
        skillsJson: JSON.stringify(["Corporate Compliance", "Regulatory Standards", "Business Ethics", "Legal Governance", "Enterprise Policy"]),
        sortOrder: 4,
        isFeatured: true,
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
