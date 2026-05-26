const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const units = await prisma.unit.findMany();
  const seen = new Set();
  for (const u of units) {
    const key = `${u.name}-${u.orgId}`;
    if (seen.has(key)) {
      const newName = `${u.name} (Duplicate ${Math.floor(Math.random() * 1000)})`;
      console.log('Renaming duplicate:', u.id, 'to', newName);
      await prisma.unit.update({ where: { id: u.id }, data: { name: newName } });
    } else {
      seen.add(key);
    }
  }
  console.log('Done renaming duplicates.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
