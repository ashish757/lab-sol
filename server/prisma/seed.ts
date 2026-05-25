import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const seedConfig = {
  organizations: [
    { id: 'dummy-org-id', name: 'Acme Corporation' },
    { id: 'global-tech-id', name: 'Global Tech Industries' },
  ],
  units: [
    { id: 'dummy-unit-alpha', name: 'Acme Factory Alpha', orgId: 'dummy-org-id' },
    { id: 'dummy-unit-beta', name: 'Acme Factory Beta', orgId: 'dummy-org-id' },
    { id: 'global-unit-alpha', name: 'GT Alpha Site', orgId: 'global-tech-id' },
    { id: 'global-unit-beta', name: 'GT Beta Site', orgId: 'global-tech-id' },
  ],
  users: [
    // Super Admins
    { email: 'admin@example.com', role: Role.SUPER_ADMIN },
    
    // Acme Corporation Users
    { email: 'orgadmin@example.com', role: Role.ORG_ADMIN, orgId: 'dummy-org-id' },
    { email: 'staff@example.com', role: Role.ORG_STAFF, orgId: 'dummy-org-id' },
    { email: 'operator@example.com', role: Role.UNIT_OPERATOR, orgId: 'dummy-org-id', unitId: 'dummy-unit-alpha' },

    // Global Tech Industries Users
    { email: 'ceo@globaltech.com', role: Role.ORG_ADMIN, orgId: 'global-tech-id' },
    { email: 'worker1@globaltech.com', role: Role.UNIT_OPERATOR, orgId: 'global-tech-id', unitId: 'global-unit-alpha' },
    { email: 'worker2@globaltech.com', role: Role.UNIT_OPERATOR, orgId: 'global-tech-id', unitId: 'global-unit-beta' },
  ],
};

async function main() {
  const password = await bcrypt.hash('pass', 10);

  console.log('Seeding Organizations...');
  for (const org of seedConfig.organizations) {
    await prisma.organization.upsert({
      where: { id: org.id },
      update: { name: org.name, status: 'ACTIVE' },
      create: { ...org, status: 'ACTIVE' },
    });
  }

  console.log('Seeding Units...');
  for (const unit of seedConfig.units) {
    await prisma.unit.upsert({
      where: { id: unit.id },
      update: { name: unit.name, orgId: unit.orgId },
      create: unit,
    });
  }

  console.log('Seeding Users...');
  for (const user of seedConfig.users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { 
        password, 
        role: user.role, 
        orgId: user.orgId || null, 
        unitId: user.unitId || null,
        status: 'ACTIVE',
        name: user.email.split('@')[0],
      },
      create: {
        email: user.email,
        name: user.email.split('@')[0],
        password,
        role: user.role,
        orgId: user.orgId,
        unitId: user.unitId,
        status: 'ACTIVE',
      },
    });
  }

  console.log('Database successfully seeded via configuration!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
