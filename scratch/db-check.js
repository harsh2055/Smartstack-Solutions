
const { PrismaClient } = require("./src/generated/prisma_new");
const prisma = new PrismaClient();

async function main() {
  try {
    const clients = await prisma.client.count();
    console.log("Client count:", clients);
    const leads = await prisma.lead.count();
    console.log("Lead count:", leads);
    const invoices = await prisma.invoice.count();
    console.log("Invoice count:", invoices);
    const team = await prisma.teamMember.count();
    console.log("Team count:", team);
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
