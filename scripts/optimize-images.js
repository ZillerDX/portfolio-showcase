// One-off: convert large project PNG/JPG (>150KB) to WebP and repoint DB references.
// sharp is NOT a project dependency. Run with a temp install:
//   SHARP_DIR=<dir containing node_modules/sharp> node scripts/optimize-images.js
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const sharp = require(path.join(process.env.SHARP_DIR, "node_modules", "sharp"));

const prisma = new PrismaClient();
const THRESHOLD = 150 * 1024;

async function main() {
  const [projects, images] = await Promise.all([
    prisma.project.findMany({ select: { id: true, coverImage: true, contentMarkdown: true } }),
    prisma.projectImage.findMany({ select: { id: true, imageUrl: true } }),
  ]);
  const urls = new Set([...projects.map((p) => p.coverImage), ...images.map((i) => i.imageUrl)]);
  const map = new Map();

  for (const url of urls) {
    if (!url.startsWith("/uploads/") || !/\.(png|jpe?g)$/i.test(url)) continue;
    const file = path.join("public", url);
    if (!fs.existsSync(file) || fs.statSync(file).size <= THRESHOLD) continue;
    const out = url.replace(/\.(png|jpe?g)$/i, ".webp");
    await sharp(file).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join("public", out));
    map.set(url, out);
    console.log(`${url}: ${Math.round(fs.statSync(file).size / 1024)}KB -> ${Math.round(fs.statSync(path.join("public", out)).size / 1024)}KB`);
  }

  for (const [from, to] of map) {
    await prisma.project.updateMany({ where: { coverImage: from }, data: { coverImage: to } });
    await prisma.projectImage.updateMany({ where: { imageUrl: from }, data: { imageUrl: to } });
    for (const p of projects) {
      if (p.contentMarkdown.includes(from)) {
        await prisma.project.update({ where: { id: p.id }, data: { contentMarkdown: p.contentMarkdown.split(from).join(to) } });
      }
    }
  }
  console.log(`Converted ${map.size} image(s). Originals are left in place; delete after verifying.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
