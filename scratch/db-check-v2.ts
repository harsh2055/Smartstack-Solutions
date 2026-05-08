
import { db } from "../src/lib/prisma";

async function main() {
  const models = ['client', 'lead', 'invoice', 'teamMember', 'activityLog', 'user'];
  
  for (const model of models) {
    try {
      const count = await (db as any)[model].count();
      console.log(`✅ ${model}: ${count} records`);
    } catch (error: any) {
      console.error(`❌ ${model} failed:`, error.message);
    }
  }

  try {
    const admin = await db.user.findFirst({ where: { role: 'ADMIN' } });
    console.log(`Admin user: ${admin ? admin.email : 'None found'}`);
  } catch (error: any) {
    console.error(`❌ Admin check failed:`, error.message);
  }

  await db.$disconnect();
}

main();
