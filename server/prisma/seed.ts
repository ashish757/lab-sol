import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email },
    update: { password, role: Role.SUPER_ADMIN },
    create: {
      email,
      password,
      role: Role.SUPER_ADMIN,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
