const { PrismaClient } = require('./src/generated/prisma_new');
const prisma = new PrismaClient();

async function main() {
  try {
    const team = await prisma.teamMember.findMany();
    console.log('Team Members:', JSON.stringify(team, null, 2));
  } catch (err) {
    console.error('Error fetching team:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
