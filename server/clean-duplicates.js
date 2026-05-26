const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const units = await prisma.unit.findMany();
  const seen = new Set();
  for (const u of units) {
    const key = `${u.name}-${u.orgId}`;
    if (seen.has(key)) {
      console.log('Deleting duplicate:', u.id, u.name);
      await prisma.unit.delete({ where: { id: u.id } });
    } else {
      seen.add(key);
    }
  }
  console.log('Done cleaning duplicates.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
