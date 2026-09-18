const fs = require("fs");
const path = require("path");

const imgDir = path.join(__dirname, "..", "public", "uploads", "images");
const docDir = path.join(__dirname, "..", "public", "uploads", "documents");

fs.mkdirSync(imgDir, { recursive: true });
fs.mkdirSync(docDir, { recursive: true });

// Minimal valid PDF generator
function createSimplePdf(title, subtitle, contentLines) {
  const content = [
    "BT",
    "/F1 22 Tf",
    "50 720 Td",
    `(${title}) Tj`,
    "/F1 12 Tf",
    "0 -28 Td",
    `(${subtitle}) Tj`,
    "0 -36 Td",
    ...contentLines.map((line) => `(${line.replace(/[()]/g, "")}) Tj\n0 -20 Td`),
    "ET",
  ].join("\n");

  const streamLength = Buffer.byteLength(content);

  return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${content}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000300 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
380
%%EOF`;
}

// Generate PDFs
fs.writeFileSync(
  path.join(docDir, "alex-chen-resume.pdf"),
  createSimplePdf(
    "ALEX CHEN - RESUME & DOSSIER",
    "Senior Full-Stack & UI Systems Architect | Bangkok / Remote",
    [
      "SUMMARY: 10+ years engineering high-scale distributed systems, web architectures and UI design systems.",
      "CORE EXPERTISE: Next.js, React, TypeScript, Go, Node.js, SQLite/PostgreSQL, Tailwind CSS.",
      "KEY HIGHLIGHT: Architected high-frequency analytics terminal servicing 50,000 updates/sec with WebGL.",
      "EDUCATION: B.S. Computer Science & Software Engineering - First Class Honors.",
      "CONTACT: alex.chen.architect@example.com | https://github.com/alexchen",
      "STATUS: Available for high-impact contracts and principal engineering roles.",
    ]
  )
);

fs.writeFileSync(
  path.join(docDir, "apex-whitepaper.pdf"),
  createSimplePdf(
    "APEX FINANCIAL TERMINAL: TECHNICAL WHITEPAPER",
    "Sub-millisecond Market Telemetry Pipeline Architecture (v1.4)",
    [
      "1. EXECUTIVE SUMMARY: Designing modern web interfaces for financial trading desks.",
      "2. CONCURRENCY: Dedicated Web Workers and OffscreenCanvas for 120fps hardware-accelerated graphs.",
      "3. MEMORY OPTIMIZATION: Zero-allocation circular ring buffers for tick processing.",
      "4. BENCHMARK: 62% reduction in GC pauses and 99.9th percentile latency under 4.2ms.",
      "5. SECURITY: Role-based HMAC verification and isolated browser sandbox.",
    ]
  )
);

fs.writeFileSync(
  path.join(docDir, "prism-design-specs.pdf"),
  createSimplePdf(
    "PRISM DESIGN SYSTEM: SPECIFICATION & GUIDELINES",
    "Zero-Runtime Token Architecture & WCAG 2.1 AA Compliance",
    [
      "1. PHILOSOPHY: Accessible, scalable, headless component foundations.",
      "2. DESIGN TOKENS: Disciplined 4px/8px geometric grid and fluid typography.",
      "3. ACCESSIBILITY: 100% automated keyboard navigation and screen-reader semantics.",
      "4. MULTI-PLATFORM: Seamless theme switching without flash-of-unstyled-content (FOUC).",
    ]
  )
);

fs.writeFileSync(
  path.join(docDir, "pulse-architecture.pdf"),
  createSimplePdf(
    "PULSE HEALTH: OFFLINE-FIRST ARCHITECTURE",
    "CRDT Reconciliation and Zero-Knowledge Biometric Encryption",
    [
      "1. PROBLEM: Ensuring healthcare tracking works reliably in low-connectivity conditions.",
      "2. CLIENT DATABASE: Embedded SQLite running local-first on mobile and desktop devices.",
      "3. SYNC ENGINE: State-based CRDTs resolving concurrent edits with deterministic merge logic.",
      "4. PRIVACY: Client-side AES-256-GCM encryption with hardware keychain key storage.",
    ]
  )
);

fs.writeFileSync(
  path.join(docDir, "synapse-system-design.pdf"),
  createSimplePdf(
    "SYNAPSE: MULTI-AGENT DAG ORCHESTRATION",
    "Distributed LLM Chaining and Resilient Execution Engine",
    [
      "1. OVERVIEW: Visual workflow pipeline for agentic AI tasks and tool calling.",
      "2. EXECUTION GRAPH: Directed Acyclic Graph with topological sorting and branch timeouts.",
      "3. STREAMING: Server-Sent Events (SSE) token pipeline with backpressure handling.",
    ]
  )
);

fs.writeFileSync(
  path.join(docDir, "sample-certificate-aws.pdf"),
  createSimplePdf(
    "AWS CERTIFIED SOLUTIONS ARCHITECT - PROFESSIONAL",
    "Amazon Web Services | Credential ID: AWS-PSA-982410",
    [
      "VERIFIED CREDENTIAL: This certifies advanced mastery in designing distributed cloud systems.",
      "DOMAINS COVERED: Complex multi-tier architectures, automated recovery, VPC peering.",
      "SECURITY & COMPLIANCE: IAM role delegation, AWS KMS envelope encryption, zero-trust policies.",
      "ISSUED: March 2024 | EXPIRATION: March 2027 | STATUS: Active & Verified.",
    ]
  )
);

fs.writeFileSync(
  path.join(docDir, "sample-certificate-cka.pdf"),
  createSimplePdf(
    "CERTIFIED KUBERNETES ADMINISTRATOR (CKA)",
    "Cloud Native Computing Foundation (CNCF) | ID: CKA-2309-8472",
    [
      "VERIFIED CREDENTIAL: Demonstrates hands-on production cluster operational competency.",
      "DOMAINS COVERED: Cluster architecture, installation, etcd backup, and pod security.",
      "NETWORKING: Ingress controllers, CNI plugins, CoreDNS debugging, network policies.",
      "ISSUED: October 2023 | EXPIRATION: October 2026 | STATUS: Active & Verified.",
    ]
  )
);

fs.writeFileSync(
  path.join(docDir, "sample-certificate-meta.pdf"),
  createSimplePdf(
    "META CERTIFIED STAFF FRONTEND ARCHITECT",
    "Meta Platforms | Credential ID: META-FE-STAFF-1120",
    [
      "VERIFIED CREDENTIAL: Principal-level web applications architecture and client performance.",
      "DOMAINS COVERED: Virtual DOM reconciliation, memory profiling, Web Workers, offline sync.",
      "DESIGN SYSTEMS: Token taxonomy, WCAG 2.1 AA accessibility, fluid typography pipelines.",
      "ISSUED: May 2023 | LIFETIME VALIDITY | STATUS: Active & Verified.",
    ]
  )
);

// High-end Profile Avatar SVG
const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs>
    <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="accentG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="skinG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" fill="url(#bgG)"/>
  <circle cx="120" cy="120" r="114" stroke="url(#accentG)" stroke-width="4" fill="none" opacity="0.8"/>
  <circle cx="120" cy="95" r="44" fill="url(#accentG)" opacity="0.9"/>
  <path d="M48 200 C48 152, 80 148, 120 148 C160 148, 192 152, 192 200 Z" fill="url(#accentG)"/>
  <circle cx="120" cy="92" r="38" fill="url(#skinG)"/>
  <path d="M60 200 C60 162, 88 158, 120 158 C152 158, 180 162, 180 200 Z" fill="#0f172a"/>
</svg>`;

// High-end Profile Header Banner SVG
const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 320" width="1200" height="320">
  <defs>
    <linearGradient id="banGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0"/>
      <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0"/>
    </linearGradient>
    <pattern id="banGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1" opacity="0.6"/>
    </pattern>
  </defs>
  <rect width="1200" height="320" fill="url(#banGrad)"/>
  <rect width="1200" height="320" fill="url(#banGrid)"/>
  <circle cx="1050" cy="80" r="220" fill="#38bdf8" opacity="0.08" filter="blur(60px)"/>
  <circle cx="150" cy="260" r="180" fill="#6366f1" opacity="0.1" filter="blur(50px)"/>
  <line x1="100" y1="180" x2="1100" y2="180" stroke="url(#lineGrad)" stroke-width="1.5"/>
</svg>`;

// Safe XML Escape helper
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
    }
  });
}

// Ultra-clean Modern Interface Mockup Generator (100% Valid XML SVG 1.1)
function createCoverSvg(title, category, colorHex) {
  const safeCategory = escapeXml(category.toUpperCase());
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e17"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${colorHex}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${colorHex}" stop-opacity="0.2"/>
    </linearGradient>
    <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" stroke-width="0.8" opacity="0.4"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="800" height="450" fill="url(#bgGrad)"/>
  <rect width="800" height="450" fill="url(#gridPattern)"/>

  <!-- Glowing Aura -->
  <circle cx="680" cy="100" r="180" fill="${colorHex}" opacity="0.12"/>
  <circle cx="120" cy="350" r="140" fill="${colorHex}" opacity="0.08"/>

  <!-- Desktop App Window Frame -->
  <rect x="40" y="35" width="720" height="380" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
  
  <!-- Window Header Bar -->
  <line x1="40" y1="80" x2="760" y2="80" stroke="#1e293b" stroke-width="1.5"/>
  <circle cx="70" cy="58" r="6" fill="#ef4444" opacity="0.8"/>
  <circle cx="90" cy="58" r="6" fill="#eab308" opacity="0.8"/>
  <circle cx="110" cy="58" r="6" fill="#22c55e" opacity="0.8"/>

  <!-- Address Bar Pill -->
  <rect x="140" y="48" width="320" height="22" rx="6" fill="#1e293b"/>
  <circle cx="155" cy="59" r="3.5" fill="${colorHex}"/>
  <text x="170" y="63" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" letter-spacing="0.5">${safeCategory}</text>

  <!-- Sidebar Column -->
  <rect x="60" y="100" width="140" height="295" rx="10" fill="#090d16" stroke="#1e293b" stroke-width="1"/>
  <rect x="75" y="120" width="110" height="12" rx="4" fill="${colorHex}" opacity="0.8"/>
  <rect x="75" y="145" width="90" height="10" rx="3" fill="#1e293b"/>
  <rect x="75" y="168" width="100" height="10" rx="3" fill="#1e293b"/>
  <rect x="75" y="191" width="80" height="10" rx="3" fill="#1e293b"/>
  <rect x="75" y="214" width="95" height="10" rx="3" fill="#1e293b"/>

  <!-- Main Canvas -->
  <rect x="220" y="100" width="520" height="295" rx="10" fill="#090d16" stroke="#1e293b" stroke-width="1"/>

  <!-- Top Metric Cards -->
  <rect x="240" y="120" width="150" height="65" rx="8" fill="#0f172a" stroke="#1e293b"/>
  <rect x="255" y="135" width="60" height="8" rx="2" fill="#334155"/>
  <rect x="255" y="152" width="90" height="16" rx="4" fill="${colorHex}" opacity="0.9"/>

  <rect x="405" y="120" width="150" height="65" rx="8" fill="#0f172a" stroke="#1e293b"/>
  <rect x="420" y="135" width="60" height="8" rx="2" fill="#334155"/>
  <rect x="420" y="152" width="70" height="16" rx="4" fill="#38bdf8" opacity="0.8"/>

  <rect x="570" y="120" width="150" height="65" rx="8" fill="#0f172a" stroke="#1e293b"/>
  <rect x="585" y="135" width="50" height="8" rx="2" fill="#334155"/>
  <rect x="585" y="152" width="85" height="16" rx="4" fill="#10b981" opacity="0.8"/>

  <!-- Center Graphic Wave / Visualization Area -->
  <rect x="240" y="200" width="480" height="175" rx="8" fill="#0f172a" stroke="#1e293b"/>
  <path d="M 260 320 Q 320 230 380 280 T 500 220 T 620 260 T 700 210" fill="none" stroke="url(#glowGrad)" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="700" cy="210" r="5" fill="${colorHex}"/>
  <circle cx="700" cy="210" r="10" stroke="${colorHex}" stroke-width="1.5" fill="none" opacity="0.6"/>
</svg>`;
}

fs.writeFileSync(path.join(imgDir, "avatar.svg"), avatarSvg);
fs.writeFileSync(path.join(imgDir, "profile-banner.svg"), bannerSvg);
fs.writeFileSync(path.join(imgDir, "project-apex.svg"), createCoverSvg("Apex Financial", "Web Applications", "#38bdf8"));
fs.writeFileSync(path.join(imgDir, "project-apex-detail.svg"), createCoverSvg("Apex Telemetry", "Telemetry", "#38bdf8"));
fs.writeFileSync(path.join(imgDir, "project-prism.svg"), createCoverSvg("Prism Design System", "Design Systems", "#a855f7"));
fs.writeFileSync(path.join(imgDir, "project-pulse.svg"), createCoverSvg("Pulse Biometrics", "Mobile and Offline", "#10b981"));
fs.writeFileSync(path.join(imgDir, "project-synapse.svg"), createCoverSvg("Synapse AI Workflow", "AI and Data Platforms", "#f59e0b"));

console.log("Safe, valid, high-resolution vector assets generated successfully!");
