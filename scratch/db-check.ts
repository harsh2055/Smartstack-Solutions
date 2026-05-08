
import { db } from "../src/lib/prisma";

async function main() {
  try {
    const clients = await db.client.count();
    console.log("Client count:", clients);
    const leads = await db.lead.count();
    console.log("Lead count:", leads);
    const invoices = await db.invoice.count();
    console.log("Invoice count:", invoices);
    const team = await db.teamMember.count();
    console.log("Team count:", team);
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
