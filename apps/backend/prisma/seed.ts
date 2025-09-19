import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

async function main() {
  const prisma = new PrismaClient();
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPass = process.env.SEED_ADMIN_PASSWORD || 'admin1234';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPass, 10);
    await prisma.user.create({ data: { fullName: 'Admin', email: adminEmail, passwordHash, role: 'ADMIN' } });
    // eslint-disable-next-line no-console
    console.log('Seeded admin:', adminEmail);
  } else {
    // eslint-disable-next-line no-console
    console.log('Admin already exists:', adminEmail);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

