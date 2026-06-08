import { prisma } from './lib/prisma'; async function main() { console.log('Groups:', await prisma.group.findMany()); } main();
