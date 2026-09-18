const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.project.findFirst({ where: { slug: 'microsme-pos' } });
  console.log('Found project:', p?.title);
  if (p) {
    await prisma.projectLink.deleteMany({ where: { projectId: p.id } });
    await prisma.projectImage.deleteMany({ where: { projectId: p.id } });
    await prisma.project.delete({ where: { id: p.id } });
    console.log('Successfully deleted microsme-pos from database.');
  } else {
    console.log('No project with slug microsme-pos found.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
