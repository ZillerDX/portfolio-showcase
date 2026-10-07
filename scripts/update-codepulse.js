// One-off content update for the CodePulse project in prisma/dev.db (prisma/seed.js is stale).
// Source: https://github.com/ZillerDX/ai-codebase-intelligence (README, redesigned Oct 2026).
// Usage: node scripts/update-codepulse.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SLUG = "ai-codebase-intelligence";
const DIR = "/uploads/projects/ai-codebase-intelligence";
const LIVE = "https://codepulse-9dl.pages.dev";
const REPO = "https://github.com/ZillerDX/ai-codebase-intelligence";

const content = `## Overview

**CodePulse** reviews a public GitHub repository in your browser. Paste a link and it reads the real files, then shows how the project is built, what looks risky, how healthy the code is, and what a change to one file would touch. No sign-in, and the analysis runs client-side.

## What it shows

| Page | What you get |
| :-- | :-- |
| **Overview** | Key takeaway, stars, contributors, merged PRs, lines of code, language mix, findings by severity |
| **How it is built** | Main areas, their role, which area uses which, an expandable diagram, tech stack |
| **Documentation** | README summary, run commands, detected web endpoints with file and line links |
| **Security issues** | Findings with file, line, snippet, why it matters and how to fix it |
| **Technical debt** | A 0 to 100 score with the formula shown, files to fix first, suggested order of work |
| **What if I change...?** | Files and tests that mention a chosen file, a risk level, a diagram of the ripple |

## How it works

1. **Read.** The browser fetches repository details, languages, the file tree and about 120 of the most relevant source files from GitHub.
2. **Scan.** A TypeScript engine counts lines, applies rule-based checks (hardcoded secrets, SQL built from strings, eval, unsafe HTML, disabled TLS verification, weak hashes, wildcard CORS and more), detects endpoints and frameworks, and builds a reference graph of which files mention which.
3. **Report.** Each page is a pure function of those facts, so the same input always gives the same page. Estimates are marked, for example "≈" on lines of code when not every file was read.
4. **Optional AI commentary.** With the local .NET 10 API and a Gemini key, four pages add a clearly labelled commentary box built from compact facts only (never file contents). The facts always come first.

## Engineering decisions

- **Deterministic first, AI second.** Numbers come from GitHub or from the files read; the model only adds commentary and can be turned off.
- **Privacy by design.** File contents are scanned in memory and discarded; only derived facts are cached in the browser for six hours, and tokens are never stored.
- **Transparent scoring.** The technical-debt formula and its inputs are shown on the page, not hidden behind a number.
- **Honest limits.** Anonymous GitHub use allows about 60 API requests per hour, and one analysis uses about five; large files are skipped and counted.

## Quality and delivery

- Angular 22 front end with unit and component tests (Vitest) and a WCAG contrast check for the colour tokens
- .NET 10 backend with xUnit tests, input validation and request size limits
- GitHub Actions run frontend and backend checks on every change; the app is deployed on Cloudflare Pages from \`main\`
`;

const images = [
  ["welcome.webp", "Welcome page: paste a GitHub link or try a real example"],
  ["overview.webp", "Overview: key takeaway, repository facts and findings by severity"],
  ["architecture.webp", "How it is built: areas, relationships and an expandable diagram"],
  ["security.webp", "Security issues: findings with file, line, impact and fix"],
];

async function main() {
  const project = await prisma.project.findUnique({ where: { slug: SLUG } });
  if (!project) throw new Error(`Project ${SLUG} not found`);

  await prisma.project.update({
    where: { id: project.id },
    data: {
      title: "CodePulse: Review Any GitHub Repository in Your Browser",
      summary:
        "Paste a public GitHub link and get an in-browser review of structure, security issues, technical debt and change impact. Angular 22, optional .NET 10 + Gemini commentary.",
      contentMarkdown: content,
      coverImage: `${DIR}/cover.webp`,
      tagsJson: JSON.stringify([
        "Angular 22",
        "TypeScript",
        ".NET 10",
        "Static Analysis",
        "C#",
        "Vitest",
        "Cloudflare Pages",
        "Gemini",
      ]),
      projectDate: "2026-10",
    },
  });

  await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
  await prisma.projectImage.createMany({
    data: images.map(([file, caption], i) => ({
      projectId: project.id,
      imageUrl: `${DIR}/${file}`,
      caption,
      sortOrder: i + 1,
    })),
  });

  await prisma.projectLink.deleteMany({ where: { projectId: project.id } });
  await prisma.projectLink.createMany({
    data: [
      { projectId: project.id, label: "Live App (Cloudflare Pages)", url: LIVE, type: "demo" },
      { projectId: project.id, label: "Source Code", url: REPO, type: "github" },
    ],
  });

  console.log("CodePulse updated: text, cover, 4 gallery images, 2 links.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
