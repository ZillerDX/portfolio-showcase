// One-off content update for prisma/dev.db (prisma/seed.js is stale; do not run db:seed).
// Usage: node scripts/update-profile-copy.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.profile.update({
    where: { id: "default" },
    data: {
      title: "Full Stack Developer | AI Integration",
      bio: "Software engineer who builds end-to-end platforms, from database design and APIs to responsive front ends and AI-powered features. Proficient in .NET, React, Python and SQL, with hands-on experience in Angular, TypeScript, Docker and real-time systems.",
      availabilityText: "Available for full-time Software Engineer / AI Engineer roles",
    },
  });

  const renamed = await prisma.projectLink.updateMany({
    where: { label: "Production App" },
    data: { label: "Live Demo" },
  });

  // Old Vercel URL returns 404; the live demo is on GitHub Pages (repo homepage).
  const qr = await prisma.projectLink.updateMany({
    where: { url: "https://qr-menu-easy-order.vercel.app" },
    data: { url: "https://zillerdx.github.io/QR-Menu-Easy-Order/" },
  });

  console.log(`Fixed ${qr.count} QR-Menu demo link(s).`);
  console.log(`Profile updated. Renamed ${renamed.count} link label(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
