const { PrismaClient } = require('./src/generated/prisma_new');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.user.updateMany({
      where: { role: 'USER' },
      data: { role: 'CLIENT' }
    });
    console.log(`Updated ${res.count} users from USER to CLIENT.`);
  } catch (err) {
    console.error('Error updating users:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
