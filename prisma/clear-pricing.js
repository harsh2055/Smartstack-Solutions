const { PrismaClient } = require('../src/generated/prisma_new');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up old pricing plans...');
  
  // Delete all existing pricing plans to ensure only the new ones remain
  const deleted = await prisma.pricingPlan.deleteMany({});
  
  console.log(`Deleted ${deleted.count} old plans.`);
  console.log('Cleanup complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
