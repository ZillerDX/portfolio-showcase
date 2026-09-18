# Tanathon Chanapha — Systems Architect & Engineering Portfolio

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Playwright](https://img.shields.io/badge/Verified_with-Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**High-density, glassmorphic portfolio architecture showcasing enterprise cloud platforms, AST code analyzers, digital twins, and corporate certifications.**

[Live System Preview](#-live-demonstration--preview) • [Architectural Pillars](#-system-architecture) • [Engineering Showcase](#-selected-works-gallery) • [Local Setup](#-quickstart--local-development)

</div>

---

## 🏛️ 1. Who (Target Stakeholders)

- **Principal Engineers & Tech Leads**: Evaluating systems design mindset, code discipline, AST comprehension, and end-to-end full-stack capabilities.
- **Engineering Hiring Managers & CTOs**: Reviewing enterprise-grade production applications (.NET 9, Angular 19, Next.js 14, WebGL2, TensorFlow.js).
- **Recruiters & Talent Partners**: Accessing verified professional certifications (Krones AG Germany), interactive contact dialog, and verified resume artifacts.

---

## ⚠️ 2. The Problem

Traditional developer portfolios suffer from systemic weaknesses:
1. **Shallow Toy Projects**: Superficial todo lists and clones that fail to demonstrate enterprise architecture, algorithmic rigor, or digital twin synchronization.
2. **Cluttered & Inflexible Navigation**: Static pill lists and unstyled native `<select>` dropdowns that break responsiveness and create visual noise.
3. **Disconnected Evidence**: Lack of auditable credentials, missing live application links, and opaque case studies without telemetry proofs.

---

## 💡 3. The Solution

**Tanathon Chanapha Portfolio Platform** solves these challenges through a unified, instrument-grade architectural showcase:
- **7 Authentic Production Systems**: Directly synchronized with GitHub repositories (`ZillerDX`), featuring high-resolution screenshot galleries, production URLs, and architecture whitepapers.
- **Dual Synchronized Filter Popovers**: "All Works" category dropdown and dynamic "All Tech Stacks" popover aligned on the same horizontal level, eliminating screen clutter while providing sub-second multi-dimensional filtering.
- **Glassmorphic Instrument Design**: Built with modern CSS design tokens, custom SVG vector icons, dark/light ambient mesh gradients, and defensive UI UX (zero cumulative layout shifts).

---

## ✨ 4. Key Functional Capabilities

| Feature | Architectural Implementation |
| :--- | :--- |
| **Dual Filter Popovers** | Custom WCAG-compliant dropdown menus for **Category** and **Tech Stack** with live project counts and instant reset. |
| **Case Study Modal** | Centered modal popup rendering Markdown specifications, technical architecture pillars, and multi-screenshot galleries. |
| **Interactive Contact** | Dedicated email dialog with 1-click clipboard copy (`chanapha.tanathon@gmail.com`) and instant checkmark feedback. |
| **Verified Accreditations** | Interactive certification gallery featuring official credentials from **Krones AG (Germany)**. |
| **Embedded Resume Viewer** | Floating docked action bar with instant in-browser modal PDF inspection and download capabilities. |
| **Engineering Dispatch** | Real-time status bulletin tracking local development prototypes and planned **.NET 10 LTS** migrations. |

---

## 📸 5. Visual Demonstration

### A. Executive Profile & Engineering Dispatch
![Executive Profile & Roadmap](docs/screenshots/hero_engineering_roadmap.png)

### B. Clean Dual Dropdowns (All Works & All Tech Stacks Aligned)
![Clean Dual Dropdowns Toolbar](docs/screenshots/dual_dropdown_showcase.png)

### C. Custom Tech Stack Popover Filter with Dynamic Counts
![Tech Stack Filter Dropdown](docs/screenshots/tech_stack_dropdown.png)

### D. Detailed Case Study & Architectural Specifications Modal
![Case Study Modal](docs/screenshots/case_study_modal.png)

---

## 🛠️ 6. Technology Stack & Rationale

```
Frontend Architecture       Next.js 14.2 (App Router) + React 18 + TypeScript 5.6
Styling & Tokens            Tailwind CSS 3.4 + Custom Ambient Mesh Utilities
ORM & Persistence           Prisma ORM 5.22 + SQLite (Embedded Zero-Config Database)
Markdown Engine             React-Markdown + Remark-GFM (GitHub Flavored Markdown)
Icons & Typography          Lucide React + Plus Jakarta Sans + JetBrains Mono
Quality & Verification      Headless Playwright Visual Auditing (0 Console Errors)
Deployment Target           Vercel Serverless / Node.js Standalone
```

---

## 📐 7. System Architecture

```mermaid
flowchart TD
    subgraph Client["Client Browser (React 18 / Next.js Client Layer)"]
        Navbar["PublicNavbar\n(Brand, Nav, Resume Modal, Theme)"]
        Hero["PublicHero\n(Profile, Roadmap Notes, Contact Modal)"]
        Certificates["PublicCertificates\n(Accreditation Cards, Descriptions)"]
        Filter["ProjectFilter\n(Search, Category Popover, Tech Stack Popover)"]
        Grid["ProjectGrid\n(Card Gallery, Tags, Case Study Links)"]
        Modal["ProjectDetailModal\n(Markdown Specs, Gallery Carousel)"]
    end

    subgraph Server["Next.js Server Layer (App Router)"]
        Page["src/app/page.tsx\n(Server Component)"]
        Prisma["Prisma ORM Client\n(@prisma/client)"]
        DB[(SQLite Embedded DB\nprisma/dev.db)]
    end

    Page -->|Queries Profile, Projects, Certs| Prisma
    Prisma -->|Executes Relational Queries| DB
    Page -->|Hydrates initial data| Client
    Filter -->|Instant Multi-Dimensional Filtering| Grid
    Grid -->|Triggers Active Selection| Modal
```

---

## 📂 8. Selected Works Portfolio Matrix

| Project | Domain | Key Architecture & Tech Stack | Live Demo / Repository |
| :--- | :--- | :--- | :--- |
| **OptiTrack WMS** | Enterprise Systems | Next.js 14, TypeScript, FastAPI, Python, 2D/3D SCADA Digital Twin | [Live App](https://optitrack-wms.vercel.app) • [GitHub](https://github.com/ZillerDX/Optitrack-WMS) |
| **CodePulse** | AI & Data Platforms | .NET 9 Minimal APIs, Angular 19 Standalone Signals, AST Telemetry | [Live System](https://zillerdx.github.io/ai-codebase-intelligence/) • [GitHub](https://github.com/ZillerDX/ai-codebase-intelligence) |
| **AI Document Workflow** | Enterprise Systems | .NET 9, Angular 19, WebCrypto SHA-256 Cryptographic Audit Chaining | [Live System](https://zillerdx.github.io/ai-document-workflow/) • [GitHub](https://github.com/ZillerDX/ai-document-workflow) |
| **Axiom (Math Studio)** | AI & Data Platforms | WebGL2, GLSL Shaders, React, TypeScript, GPU Raymarching | [Live Lab](https://zillerdx.github.io/math-generative-art-studio/) • [GitHub](https://github.com/ZillerDX/math-generative-art-studio) |
| **ML Model Playground** | AI & Data Platforms | TensorFlow.js, React 18, TypeScript, In-Browser Neural Networks | [Live Playground](https://zillerdx.github.io/ml-model-playground/) • [GitHub](https://github.com/ZillerDX/ml-model-playground) |
| **GlobePass** | Web Applications | Next.js 14, TypeScript, FastAPI, Python, 227-Country Consular Telemetry | [Live App](https://globepass-visa.vercel.app) • [GitHub](https://github.com/ZillerDX/globepass-visa) |
| **QR-Menu Easy Order** | Web Applications | React, TypeScript, Tailwind CSS, Local-First Restaurant KDS | [Live App](https://qr-menu-easy-order.vercel.app) • [GitHub](https://github.com/ZillerDX/QR-Menu-Easy-Order) |

---

## 🚀 9. Quickstart & Local Development

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm** or **pnpm**

### Installation & Run
```bash
# 1. Clone the repository
git clone https://github.com/ZillerDX/portfolio-showcase.git
cd portfolio-showcase

# 2. Install dependencies
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification
```bash
# Typecheck
npx tsc --noEmit

# Production Build
npm run build

# Start Production Server
npm run start
```

---

## 🌐 10. Deployment Guide (Vercel)

This application is built with **Next.js 14 App Router** and **Prisma SQLite**. It is optimized for zero-configuration 1-click deployment on **Vercel**:

1. Push your repository to GitHub: `https://github.com/ZillerDX/portfolio-showcase`
2. Import the repository into [Vercel](https://vercel.com/new).
3. Vercel automatically detects Next.js, executes `prisma generate && next build`, and provisions the production preview.

---

## 👤 Author & Architecture

**Tanathon Chanapha**  
*Full-Stack & Systems Architect | Software Engineer*  
- **Email**: [chanapha.tanathon@gmail.com](mailto:chanapha.tanathon@gmail.com)  
- **GitHub**: [@ZillerDX](https://github.com/ZillerDX)  
- **LinkedIn**: [Tanathon Chanapha](https://www.linkedin.com/in/tanathon-chanapha-452177427)  
- **Jobsdb**: [Profile](https://th.jobsdb.com/th/profiles/tanathon-chanapha-R26rW062z5)  
