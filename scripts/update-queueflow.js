const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  console.log("--- Updating .NET projects and adding QueueFlow to dev.db ---");

  // 1. Update Profile skillsJson
  const profile = await prisma.profile.findUnique({ where: { id: "default" } });
  if (profile) {
    let skills = JSON.parse(profile.skillsJson || "[]");
    skills = skills.map((group) => {
      if (
        group.category === "Backend & Distributed Systems" ||
        group.category === "Backend & Systems"
      ) {
        group.skills = group.skills.map((s) => {
          if (s.name.includes(".NET")) return { name: ".NET 10 Minimal APIs" };
          if (s.name === "C#") return { name: "C# 14" };
          return s;
        });
      }
      return group;
    });
    await prisma.profile.update({
      where: { id: "default" },
      data: { skillsJson: JSON.stringify(skills) },
    });
    console.log("Profile skillsJson updated to .NET 10 Minimal APIs & C# 14");
  }

  // 2. Update DeskFlow tags
  const deskflow = await prisma.project.findFirst({ where: { slug: "deskflow" } });
  if (deskflow) {
    await prisma.project.update({
      where: { id: deskflow.id },
      data: {
        sortOrder: 2,
        isFeatured: true,
        tagsJson: JSON.stringify([
          ".NET 10",
          "C# 14",
          "Angular 21",
          "SignalR",
          "WebSockets",
          "EF Core",
          "Tailwind CSS",
        ]),
      },
    });
    console.log("DeskFlow tags updated to .NET 10");
  }

  // 3. Update EquipLend tags
  const equiplend = await prisma.project.findFirst({ where: { slug: "equiplend" } });
  if (equiplend) {
    await prisma.project.update({
      where: { id: equiplend.id },
      data: {
        sortOrder: 3,
        isFeatured: true,
        tagsJson: JSON.stringify([
          ".NET 10",
          "C# 14",
          "React 19",
          "Tailwind CSS",
          "Minimal APIs",
          "EF Core",
          "Bilingual i18n",
        ]),
      },
    });
    console.log("EquipLend tags updated to .NET 10");
  }

  // 4. Update CodePulse tags & summary
  const codepulse = await prisma.project.findFirst({
    where: { slug: "ai-codebase-intelligence" },
  });
  if (codepulse) {
    await prisma.project.update({
      where: { id: codepulse.id },
      data: {
        sortOrder: 5,
        summary:
          "Autonomous AI codebase intelligence and architecture telemetry platform (.NET 10 + Angular 19) providing real-time AST structural scanning, dependency drift detection, and health scorecards.",
        tagsJson: JSON.stringify([
          ".NET 10",
          "C# 14",
          "Angular 19",
          "TypeScript",
          "AST Analysis",
          "Tailwind CSS",
          "GitHub Pages",
        ]),
      },
    });
    console.log("CodePulse tags updated to .NET 10");
  }

  // 5. Update AI Document Workflow tags & summary
  const docWorkflow = await prisma.project.findFirst({
    where: { slug: "ai-document-workflow" },
  });
  if (docWorkflow) {
    await prisma.project.update({
      where: { id: docWorkflow.id },
      data: {
        sortOrder: 6,
        summary:
          "Enterprise-grade document workflow with automated segregation of duties, cryptographic SHA-256 verification, and compliance approval chains built on .NET 10 and Angular 19.",
        tagsJson: JSON.stringify([
          ".NET 10",
          "C# 14",
          "Angular 19",
          "WebCrypto SHA-256",
          "TypeScript",
          "Tailwind CSS",
          "Compliance",
        ]),
      },
    });
    console.log("AI Document Workflow tags updated to .NET 10");
  }

  // 6. Find or create QueueFlow project
  const catEnterprise = await prisma.category.findFirst({
    where: { slug: "enterprise-systems" },
  });
  if (!catEnterprise) {
    throw new Error("Category enterprise-systems not found");
  }

  let queueflow = await prisma.project.findFirst({ where: { slug: "queueflow" } });

  const queueflowMarkdown = `## Executive Overview

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
`;

  const queueflowData = {
    title: "QueueFlow — Enterprise Real-Time Distributed Queue Management System",
    slug: "queueflow",
    summary:
      "High-throughput real-time distributed queue management and counter dispatch platform engineered with .NET 10 LTS Minimal APIs, Angular 19 Standalone Signals, SignalR WebSockets, and PostgreSQL SKIP LOCKED pessimistic concurrency.",
    categoryId: catEnterprise.id,
    coverImage: "/uploads/projects/queueflow/preview.png",
    tagsJson: JSON.stringify([
      ".NET 10",
      "C# 14",
      "Angular 19",
      "SignalR",
      "PostgreSQL",
      "WebSockets",
      "Tailwind CSS",
      "PWA",
    ]),
    isFeatured: true,
    isPublished: true,
    sortOrder: 1,
    projectDate: "2026-09",
    contentMarkdown: queueflowMarkdown,
  };

  if (!queueflow) {
    queueflow = await prisma.project.create({
      data: {
        ...queueflowData,
        links: {
          create: [
            {
              label: "Live Demo (Vercel)",
              url: "https://queueflow-wheat.vercel.app",
              type: "live",
            },
            {
              label: "GitHub Repository",
              url: "https://github.com/ZillerDX/QueueFlow",
              type: "github",
            },
          ],
        },
        images: {
          create: [
            {
              imageUrl: "/uploads/projects/queueflow/preview.png",
              caption: "QueueFlow Customer Intake Portal & Instant Mobile Pass",
              sortOrder: 1,
            },
            {
              imageUrl: "/uploads/projects/queueflow/ticket-tracker.png",
              caption: "Real-Time Digital Ticket Tracker & Position Countdown",
              sortOrder: 2,
            },
            {
              imageUrl: "/uploads/projects/queueflow/staff-terminal.png",
              caption: "Multi-Desk Staff Service Terminal & Atomic Queue Calling",
              sortOrder: 3,
            },
            {
              imageUrl: "/uploads/projects/queueflow/tv-display.png",
              caption: "16:9 Public TV Digital Signage with Real-Time Audio Chime",
              sortOrder: 4,
            },
            {
              imageUrl: "/uploads/projects/queueflow/admin-management.png",
              caption: "Branch Counter Configuration & Service Desk Management",
              sortOrder: 5,
            },
            {
              imageUrl: "/uploads/projects/queueflow/qr-standee-modal.png",
              caption: "Print-Ready A4 Desk Standee & Entrance QR Generator",
              sortOrder: 6,
            },
          ],
        },
      },
    });
    console.log("QueueFlow created with ID:", queueflow.id);
  } else {
    await prisma.project.update({
      where: { id: queueflow.id },
      data: queueflowData,
    });
    await prisma.projectLink.deleteMany({ where: { projectId: queueflow.id } });
    await prisma.projectLink.createMany({
      data: [
        {
          projectId: queueflow.id,
          label: "Live Demo (Vercel)",
          url: "https://queueflow-wheat.vercel.app",
          type: "live",
        },
        {
          projectId: queueflow.id,
          label: "GitHub Repository",
          url: "https://github.com/ZillerDX/QueueFlow",
          type: "github",
        },
      ],
    });
    await prisma.projectImage.deleteMany({ where: { projectId: queueflow.id } });
    await prisma.projectImage.createMany({
      data: [
        {
          projectId: queueflow.id,
          imageUrl: "/uploads/projects/queueflow/preview.png",
          caption: "QueueFlow Customer Intake Portal & Instant Mobile Pass",
          sortOrder: 1,
        },
        {
          projectId: queueflow.id,
          imageUrl: "/uploads/projects/queueflow/ticket-tracker.png",
          caption: "Real-Time Digital Ticket Tracker & Position Countdown",
          sortOrder: 2,
        },
        {
          projectId: queueflow.id,
          imageUrl: "/uploads/projects/queueflow/staff-terminal.png",
          caption: "Multi-Desk Staff Service Terminal & Atomic Queue Calling",
          sortOrder: 3,
        },
        {
          projectId: queueflow.id,
          imageUrl: "/uploads/projects/queueflow/tv-display.png",
          caption: "16:9 Public TV Digital Signage with Real-Time Audio Chime",
          sortOrder: 4,
        },
        {
          projectId: queueflow.id,
          imageUrl: "/uploads/projects/queueflow/admin-management.png",
          caption: "Branch Counter Configuration & Service Desk Management",
          sortOrder: 5,
        },
        {
          projectId: queueflow.id,
          imageUrl: "/uploads/projects/queueflow/qr-standee-modal.png",
          caption: "Print-Ready A4 Desk Standee & Entrance QR Generator",
          sortOrder: 6,
        },
      ],
    });
    console.log("QueueFlow updated with ID:", queueflow.id);
  }

  // 7. Update OptiTrack sortOrder
  const optitrack = await prisma.project.findFirst({
    where: { slug: "optitrack-wms" },
  });
  if (optitrack) {
    await prisma.project.update({
      where: { id: optitrack.id },
      data: { sortOrder: 4, isFeatured: true },
    });
    console.log("OptiTrack sortOrder updated to 4");
  }

  console.log("--- Update completed successfully! ---");
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
