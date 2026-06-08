import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  await prisma.slaveAccount.deleteMany({});
  await prisma.group.deleteMany({});
  console.log('Deleted all mock groups and slaves');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
