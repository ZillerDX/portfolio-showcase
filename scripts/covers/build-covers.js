// Generates project cover thumbnails (1600x1000 WebP) from real screenshots.
// Not part of the app build. Requires: Google Chrome (headless) and sharp installed OUTSIDE the project:
//   SHARP_DIR=<dir containing node_modules/sharp> node scripts/covers/build-covers.js [slug ...]
// Output: public/uploads/projects/<slug>/cover.webp (the DB is updated separately).
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..");
const UPLOADS = path.join(ROOT, "public", "uploads", "projects");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const sharp = require(path.join(process.env.SHARP_DIR || "", "node_modules", "sharp"));
const configs = require("./covers.config.js");

const FONTS =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

const fileUrl = (slug, file) => "file:///" + path.join(UPLOADS, slug, file).replace(/\\/g, "/");

function frame(shot, slug) {
  const s = shot.style || {};
  const style = `left:${s.left}px; top:${s.top}px; width:${s.width}px; transform:rotate(${s.rot || 0}deg); z-index:${s.z || 1}; ${s.opacity ? `opacity:${s.opacity};` : ""}`;
  const img = `<img src="${fileUrl(slug, shot.src)}" style="${shot.imgStyle || ""}">`;
  if (shot.device === "phone") {
    return `<div class="phone" style="${style}"><div class="notch"></div>${img}</div>`;
  }
  return `<div class="frame" style="${style}"><div class="bar"><span></span><span></span><span></span></div>${img}</div>`;
}

function html(c) {
  const t = c.theme;
  const [h1a, h1b] = c.headline;
  const mock =
    c.mock && c.mock.kind === "input"
      ? `<div class="input"><div class="url">${c.mock.prefix || ""}<b>${c.mock.text}</b></div><div class="btn">${c.mock.btn}</div></div>`
      : c.mock && c.mock.kind === "pills"
        ? `<div class="pills">${c.mock.items.map((p) => `<div class="pill"><i></i>${p}</div>`).join("")}</div>`
        : "";
  const floats = (c.floats || [])
    .map((f) => {
      const s = f.style || {};
      return `<div class="float" style="left:${s.left}px; top:${s.top}px; transform:rotate(${s.rot || 0}deg); z-index:${s.z || 5};">
        <div class="k">${f.k}</div><div class="v" style="${f.vSize ? `font-size:${f.vSize}px;` : ""}">${f.v}${f.small ? `<small> ${f.small}</small>` : ""}</div>${f.tag ? `<div class="t">${f.tag}</div>` : ""}</div>`;
    })
    .join("");
  const stage = c.stage || { left: 820, top: 150 };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><link href="${FONTS}" rel="stylesheet"><style>
  :root { --ink:${t.ink}; --muted:${t.muted}; --accent:${t.accent}; --card:${t.card}; --line:${t.line}; --tagbg:${t.tagbg}; --tagfg:${t.tagfg}; --head:${t.head}; }
  * { box-sizing:border-box; margin:0; }
  html, body { width:1600px; height:1000px; overflow:hidden; background:${t.bg[0]}; }
  body { position:relative; font-family:'Inter','Segoe UI',sans-serif; color:var(--ink); }
  .bg { position:absolute; inset:0; background: radial-gradient(900px 600px at 88% 8%, ${t.glow[0]}, transparent 60%), radial-gradient(800px 700px at 0% 100%, ${t.glow[1]}, transparent 60%), linear-gradient(135deg, ${t.bg[0]}, ${t.bg[1]}); }
  .grid { position:absolute; inset:0; opacity:${t.gridOpacity ?? 0.5}; background-image:linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size:64px 64px; -webkit-mask-image:linear-gradient(120deg, transparent 20%, #000 90%); mask-image:linear-gradient(120deg, transparent 20%, #000 90%); }
  .left { position:absolute; left:96px; top:190px; width:${c.leftWidth || 720}px; }
  .brand { display:flex; align-items:center; gap:16px; font-family:var(--head); font-weight:700; font-size:44px; letter-spacing:-.5px; }
  .mark { width:46px; height:46px; border-radius:14px; background:var(--accent); display:grid; place-items:center; }
  .eyebrow { margin-top:52px; font-size:20px; font-weight:600; letter-spacing:3.5px; color:var(--accent); text-transform:uppercase; }
  h1 { margin-top:18px; font-family:var(--head); font-weight:700; font-size:${c.h1Size || 88}px; line-height:1.05; letter-spacing:${c.h1Spacing ?? -1}px; word-spacing:4px; }
  h1 em { font-style:normal; color:var(--accent); }
  .sub { margin-top:22px; font-size:26px; line-height:1.4; color:var(--muted); max-width:${c.leftWidth || 720}px; }
  .input { margin-top:40px; display:flex; align-items:center; gap:14px; width:700px; padding:12px 12px 12px 26px; background:var(--card); border:2px solid var(--line); border-radius:18px; box-shadow:0 14px 40px rgba(0,0,0,.14); }
  .input .url { flex:1; font-size:26px; color:var(--muted); font-weight:500; white-space:nowrap; } .input .url b { color:var(--ink); font-weight:600; }
  .input .btn { padding:16px 30px; border-radius:12px; background:var(--accent); color:#fff; font-weight:600; font-size:24px; }
  .pills { margin-top:36px; display:flex; flex-direction:column; gap:12px; }
  .pill { display:flex; align-items:center; gap:14px; width:640px; padding:16px 22px; border-radius:16px; background:var(--card); border:2px solid var(--line); font-size:24px; font-weight:600; box-shadow:0 10px 30px rgba(0,0,0,.10); }
  .pill i { width:12px; height:12px; border-radius:50%; background:var(--accent); flex:none; }
  .chips { margin-top:28px; display:flex; flex-wrap:wrap; gap:12px; width:${c.chipsWidth || 560}px; }
  .chip { padding:10px 20px; border-radius:999px; background:var(--card); border:1.5px solid var(--line); font-size:21px; font-weight:600; }
  .chip i { display:inline-block; width:10px; height:10px; border-radius:50%; background:var(--accent); margin-right:10px; }
  .stage { position:absolute; left:${stage.left}px; top:${stage.top}px; width:900px; height:900px; }
  .frame { position:absolute; background:var(--card); border-radius:22px; overflow:hidden; border:2px solid var(--line); box-shadow:0 40px 90px rgba(0,0,0,.35), 0 8px 20px rgba(0,0,0,.18); }
  .frame .bar { height:44px; background:${t.bar}; border-bottom:2px solid var(--line); display:flex; align-items:center; gap:9px; padding:0 18px; }
  .frame .bar span { width:13px; height:13px; border-radius:50%; background:${t.dot}; }
  .frame img { display:block; width:100%; }
  .phone { position:absolute; background:#0b0b0f; border-radius:56px; padding:14px; box-shadow:0 40px 90px rgba(0,0,0,.40), 0 8px 20px rgba(0,0,0,.2); }
  .phone img { display:block; width:100%; border-radius:44px; }
  .notch { position:absolute; top:22px; left:50%; width:110px; height:26px; margin-left:-55px; background:#0b0b0f; border-radius:16px; z-index:3; }
  .float { position:absolute; background:var(--card); border:2px solid var(--line); border-radius:20px; padding:20px 26px; box-shadow:0 26px 60px rgba(0,0,0,.30); }
  .float .k { font-size:17px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); font-weight:600; }
  .float .v { margin-top:6px; font-family:var(--head); font-weight:700; font-size:54px; line-height:1; } .float .v small { font-size:26px; color:var(--muted); font-family:'Inter',sans-serif; font-weight:500; }
  .float .t { margin-top:10px; display:inline-block; padding:6px 14px; border-radius:999px; background:var(--tagbg); color:var(--tagfg); font-weight:600; font-size:18px; }
  </style></head><body>
  <div class="bg"></div><div class="grid"></div>
  <div class="left">
    <div class="brand"><div class="mark"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${c.brand.icon}</svg></div>${c.brand.name}</div>
    <div class="eyebrow">${c.eyebrow}</div>
    <h1>${h1a}<em>${h1b}</em></h1>
    ${c.sub ? `<div class="sub">${c.sub}</div>` : ""}
    ${mock}
    ${c.chips ? `<div class="chips">${c.chips.map((x) => `<span class="chip"><i></i>${x}</span>`).join("")}</div>` : ""}
  </div>
  <div class="stage">${c.shots.map((s) => frame(s, c.slug)).join("")}${floats}</div>
  </body></html>`;
}

async function build(c) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cover-"));
  const htmlFile = path.join(dir, `${c.slug}.html`);
  const png = path.join(dir, `${c.slug}.png`);
  fs.writeFileSync(htmlFile, html(c), "utf8");
  execFileSync(
    CHROME,
    ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--force-device-scale-factor=1", "--window-size=1600,1000", "--virtual-time-budget=15000", `--screenshot=${png}`, "file:///" + htmlFile.replace(/\\/g, "/")],
    { stdio: "ignore" }
  );
  const out = path.join(UPLOADS, c.slug, "cover.webp");
  await sharp(png).webp({ quality: 86 }).toFile(out);
  fs.copyFileSync(png, path.join(os.tmpdir(), `cover-preview-${c.slug}.png`));
  console.log(`${c.slug}: ${Math.round(fs.statSync(out).size / 1024)}KB -> ${out}`);
}

(async () => {
  const only = process.argv.slice(2);
  for (const c of configs) if (!only.length || only.includes(c.slug)) await build(c);
})();
